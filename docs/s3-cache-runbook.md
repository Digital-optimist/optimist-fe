# S3 Cache-Control runbook

PageSpeed Insights flagged `optimist-fe-assets.s3.amazonaws.com` as missing long
cache lifetimes — ~301 KiB of repeat-visit savings. The bucket serves immutable
brand assets (logos, hero images) that never change for a given filename, so we
can set a 1-year `Cache-Control` header.

## Apply to existing objects (one-time)

Run from a shell with AWS credentials for the account that owns
`optimist-fe-assets`:

```bash
aws s3 cp \
  s3://optimist-fe-assets \
  s3://optimist-fe-assets \
  --recursive \
  --metadata-directive REPLACE \
  --cache-control "public, max-age=31536000, immutable" \
  --acl bucket-owner-full-control
```

This rewrites every object in place with the new header. Existing object
contents are untouched; only metadata changes. Run a `--dryrun` first if you
want to see the file list:

```bash
aws s3 cp s3://optimist-fe-assets s3://optimist-fe-assets \
  --recursive --metadata-directive REPLACE \
  --cache-control "public, max-age=31536000, immutable" --dryrun | head -20
```

## Apply to future uploads

So uploads don't drift back to no-cache, either:

1. **AWS Console**: bucket → Properties → Default object metadata → add
   `Cache-Control: public, max-age=31536000, immutable`. Applies to new objects
   only.
2. **CI/upload script**: pass `--cache-control` on every `aws s3 cp` /
   `s3.putObject` call.

## CloudFront invalidation (only if behind CloudFront)

If `optimist-fe-assets.s3.amazonaws.com` is fronted by CloudFront, browsers and
edge caches won't pick up the new headers until objects are re-fetched.
Invalidate everything once:

```bash
aws cloudfront create-invalidation \
  --distribution-id <DISTRIBUTION_ID> \
  --paths "/*"
```

If served direct from S3 (no CloudFront), no invalidation needed — browsers
will pick up the new headers on the next conditional request.

## Caveat — versioning

Setting `immutable` means **never re-fetched until URL changes**. Safe only if
file URLs are immutable (e.g. content-hashed filenames or strictly never
overwritten). If anyone updates `Frame 48095518.png` under the same key in the
future, they must also change the filename, OR weaken the header to
`max-age=86400` (1 day).

Current bucket contents are mostly named-by-content (logo, hero PNGs, team
photos) — safe for `immutable`.

## Verify

```bash
curl -I https://optimist-fe-assets.s3.amazonaws.com/AC1.png
```

Expect:
```
HTTP/1.1 200 OK
Cache-Control: public, max-age=31536000, immutable
```

## PSI re-measurement

After applying:
- "Use efficient cache lifetimes" PSI insight should drop from "Est savings of
  301 KiB" to listing only Facebook / Clarity / Snapmint (third-party, out of
  our control).
- Repeat-visit performance score gets a small bump (5-10 points on warm load).
