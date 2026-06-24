// Local dev CORS proxy for Razorpay Magic Checkout.
//
// Browser→api.razorpay.com is CORS-blocked, so even in dev the storefront's
// Steps 1/2/5 must go through a proxy. This is a tiny stand-in for the Lambda
// (docs/razorpay-proxy) that runs on your machine.
//
//   node scripts/dev-razorpay-proxy.mjs
//
// Then set (already in .env.local): NEXT_PUBLIC_RAZORPAY_PROXY_URL=http://localhost:8787
//
// It forwards the path + query (including ?key_id=…) straight to Razorpay and
// adds permissive CORS headers. Dev-only — do NOT use in production (the locked
// down Lambda is the production proxy).

import http from "node:http";

const PORT = Number(process.env.PORT || 8787);
const RZP_API = "https://api.razorpay.com";

const ALLOWED_PATHS = new Set([
  "/v1/magic/checkout/shopify",
  "/v1/magic/order/shopify",
  "/v1/1cc/shopify/complete",
]);

function cors(res, origin) {
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Accept");
  res.setHeader("Access-Control-Max-Age", "86400");
  res.setHeader("Vary", "Origin");
}

const server = http.createServer((req, res) => {
  const origin = req.headers.origin || "*";
  cors(res, origin);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (req.method !== "POST" || !ALLOWED_PATHS.has(url.pathname)) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "not found" }));
    return;
  }

  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", async () => {
    const body = Buffer.concat(chunks).toString("utf8");
    const target = `${RZP_API}${url.pathname}${url.search}`;
    try {
      const upstream = await fetch(target, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body,
      });
      const text = await upstream.text();
      res.writeHead(upstream.status, { "Content-Type": "application/json" });
      res.end(text);
      console.log(`${upstream.status}  ${url.pathname}`);
    } catch (err) {
      console.error("upstream error", err);
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "upstream error" }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Razorpay dev proxy → ${RZP_API}`);
  console.log(`Listening on http://localhost:${PORT}`);
});
