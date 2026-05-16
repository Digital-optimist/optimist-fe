#!/usr/bin/env node
/**
 * One-shot image optimization for the /products/ performance pass.
 *
 * - Local /public/assets/* PNGs → WebPs at correct max dimensions
 * - Heavy decorative assets previously hosted on S3 (comparison-shadow-bg,
 *   acComparison, warranty-card) → downloaded, optimized, written into
 *   public/assets/products/ so they ship from the same origin as the app.
 *
 * Re-runnable: skips outputs that already exist unless `--force` is passed.
 */

import sharp from "sharp";
import { mkdir, stat, readFile, writeFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import https from "node:https";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const productsAssetsDir = path.join(repoRoot, "public/assets/products");
const publicAssetsDir = path.join(repoRoot, "public/assets");
const force = process.argv.includes("--force");

const localTargets = [
  {
    src: "public/assets/inside-optimist/ac-unit.png",
    out: "public/assets/inside-optimist/ac-unit.webp",
    maxWidth: 1200,
    quality: 78,
  },
  {
    src: "public/assets/inside-optimist/compressor.png",
    out: "public/assets/inside-optimist/compressor.webp",
    maxWidth: 600,
    quality: 78,
  },
  {
    src: "public/assets/inside-optimist/heat-exchanger.jpeg",
    out: "public/assets/inside-optimist/heat-exchanger.webp",
    maxWidth: 600,
    quality: 78,
  },
  {
    src: "public/assets/inside-optimist/expansion-valve.png",
    out: "public/assets/inside-optimist/expansion-valve.webp",
    maxWidth: 600,
    quality: 78,
  },
  {
    src: "public/assets/team mobile.png",
    out: "public/assets/team/team-mobile.webp",
    maxWidth: 800,
    quality: 78,
  },
  {
    src: "public/assets/team/team-lab-photo.jpg",
    out: "public/assets/team/team-lab-photo.webp",
    maxWidth: 1440,
    quality: 78,
  },
];

// Heavy decorative assets that used to live on S3. We now self-host them
// inside the Next.js public/ tree so they ship from the same origin (no S3
// preconnect needed) and stay under our control.
const remoteTargets = [
  {
    url: "https://optimist-fe-assets.s3.amazonaws.com/comparison-shadow-bg.png",
    out: "comparison-shadow-bg.webp",
    maxWidth: 1440,
    quality: 60, // 30% opacity decorative bg — quality 60 is plenty
  },
  {
    url: "https://optimist-fe-assets.s3.amazonaws.com/acComparison.png",
    out: "acComparison.webp",
    maxWidth: 1440,
    quality: 78,
  },
  {
    // WarrantySection only shows a cropped slice (≈28-66% horizontal,
    // ≈8-88% vertical of the 1536×1024 source) via CSS positioning.
    // Pre-crop to the visible region so we can drop the wasteful CSS hack
    // and let next/image deliver the right pixels.
    url: "https://optimist-fe-assets.s3.amazonaws.com/warranty-card.png",
    out: "warranty-card.webp",
    extract: { left: 432, top: 80, width: 576, height: 822 },
    maxWidth: 600,
    quality: 80,
  },
];

// Logo (Frame 48095518.png) — Lighthouse flagged this as the single biggest
// avoidable image on every page: 85 KiB PNG at 4896×976 served for a
// 278×55 display slot. The custom next/image loader passes S3 URLs through
// without resizing, so the only fix is to pre-optimize and self-host.
// Output goes to /public/assets/logo.webp; assets.ts (frame48095518) points
// at the local path.
const logoTarget = {
  url: "https://optimist-fe-assets.s3.amazonaws.com/Frame%2048095518.png",
  out: path.join(publicAssetsDir, "logo.webp"),
  maxWidth: 800, // Matches the <Image width={800}> declared in Footer.tsx
  quality: 82,
};

function fmtKB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

function download(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          download(res.headers.location).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`${url} → HTTP ${res.statusCode}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function convertBuffer(buf, { maxWidth, quality, extract }) {
  let pipeline = sharp(buf);
  if (extract) {
    pipeline = pipeline.extract(extract);
  }
  const meta = await sharp(buf).metadata();
  const effectiveWidth = extract ? extract.width : meta.width;
  if (effectiveWidth && effectiveWidth > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }
  return pipeline.webp({ quality, effort: 6 }).toBuffer();
}

async function processLocal(t) {
  const srcPath = path.join(repoRoot, t.src);
  const outPath = path.join(repoRoot, t.out);

  if (!(await exists(srcPath))) {
    console.log(`  ⚠ skip (src missing): ${t.src}`);
    return;
  }
  if (!force && (await exists(outPath))) {
    console.log(`  ✓ already exists: ${t.out}`);
    return;
  }

  const srcBuf = await readFile(srcPath);
  const outBuf = await convertBuffer(srcBuf, t);

  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, outBuf);

  const srcSize = (await stat(srcPath)).size;
  const outSize = outBuf.length;
  const savings = ((1 - outSize / srcSize) * 100).toFixed(0);
  console.log(`  ✓ ${t.src} (${fmtKB(srcSize)}) → ${t.out} (${fmtKB(outSize)})  -${savings}%`);
}

async function processRemote(t) {
  const outPath = path.join(productsAssetsDir, t.out);
  if (!force && (await exists(outPath))) {
    console.log(`  ✓ already exists: public/assets/products/${t.out}`);
    return;
  }

  console.log(`  ↓ downloading ${t.url} …`);
  const srcBuf = await download(t.url);
  const outBuf = await convertBuffer(srcBuf, t);

  await mkdir(productsAssetsDir, { recursive: true });
  await writeFile(outPath, outBuf);

  const srcSize = srcBuf.length;
  const outSize = outBuf.length;
  const savings = ((1 - outSize / srcSize) * 100).toFixed(0);
  console.log(`  ✓ ${t.url.split("/").pop()} (${fmtKB(srcSize)}) → ${t.out} (${fmtKB(outSize)})  -${savings}%`);
}

async function processLogo(t) {
  if (!force && (await exists(t.out))) {
    console.log(`  ✓ already exists: public/assets/logo.webp`);
    return;
  }
  console.log(`  ↓ downloading ${t.url} …`);
  const srcBuf = await download(t.url);
  const outBuf = await convertBuffer(srcBuf, t);
  await mkdir(path.dirname(t.out), { recursive: true });
  await writeFile(t.out, outBuf);
  const srcSize = srcBuf.length;
  const outSize = outBuf.length;
  const savings = ((1 - outSize / srcSize) * 100).toFixed(0);
  console.log(`  ✓ logo (${fmtKB(srcSize)}) → public/assets/logo.webp (${fmtKB(outSize)})  -${savings}%`);
}

(async () => {
  console.log("\nOptimizing local /public/assets …");
  for (const t of localTargets) {
    try {
      await processLocal(t);
    } catch (e) {
      console.error(`  ✗ ${t.src}: ${e.message}`);
    }
  }

  console.log("\nDownloading + optimizing decorative assets → public/assets/products/ …");
  for (const t of remoteTargets) {
    try {
      await processRemote(t);
    } catch (e) {
      console.error(`  ✗ ${t.url}: ${e.message}`);
    }
  }

  console.log("\nOptimizing logo → public/assets/logo.webp …");
  try {
    await processLogo(logoTarget);
  } catch (e) {
    console.error(`  ✗ ${logoTarget.url}: ${e.message}`);
  }

  console.log("\nDone. All assets are now self-hosted in public/.");
})();