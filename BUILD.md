# Louisville Junk Removal Co — build notes

Static site. No dependencies, no framework. Cloudflare Pages serves the
repo root as-is (build command: blank, output directory: blank).

## Editing content

- **Homepage:** edit `index.html` directly (self-contained, inline CSS).
- **Service-area pages** (`jeffersontown.html`, etc.): do NOT edit the
  `.html` files by hand — they are generated. Edit `scripts/cities-data.js`
  then rebuild.
- **Blog posts:** edit `scripts/blog-data.js` then rebuild.
- **Business facts** (phone, email, domain, city list): `scripts/site-config.js`.

## Rebuild

```
node scripts/generate.js
```

Regenerates: every `<city>.html`, `blog/*.html`, `blog/index.html`,
`sitemap.xml`, `robots.txt`, and `_redirects`.

## After any change

```
git add -A
git commit -m "describe the change"
git push
```

Cloudflare Pages redeploys in ~60 seconds.

## Adding a new page

Every new `.html` file needs a matching `/<name>.html /<name> 301` line in
`_redirects` (the generator handles this automatically for anything listed
in `site-config.js` / `blog-data.js`). Each page's FAQ schema must match its
visible FAQ text — the generators build both from the same data, so keep it
that way.
