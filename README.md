# Amore di Mamma — local preview

## Start locally

Use Node.js 22.12 or newer (Node 22 LTS recommended). If you use nvm, run `nvm use`.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite, normally http://localhost:8080.
Stop the server with Ctrl+C. Changes to the site update automatically while it runs.

## Build a shareable static preview

```sh
npm run build
```

To check the built version locally, run `npm run preview` and open the URL it prints.

The upload-ready website is in **`dist/client/`**, including its prerendered
`index.html` and `assets/` folder. ZIP the **contents** of that directory so
`index.html` is at the ZIP root, then upload it to a static-site preview service
that accepts ZIP uploads. No Node server is needed to host this output.

For example, on Linux/macOS with `zip` installed:

```sh
(cd dist/client && zip -r ../../site-preview.zip .)
```

Rebuild and recreate the ZIP after making changes. Preview the site through an
HTTP server or hosting service rather than double-clicking `index.html`.
The static export covers the current single-page site; future features requiring
server-side endpoints will need server-capable hosting.

To share editable source instead, include the source, configuration files, and
`package-lock.json`; omit `node_modules/` and generated build folders. The recipient
can use the local startup commands above.

## Missing original images

This source export arrived with an empty `src/assets/` directory. The Vite setup
provides temporary plain, solid-color placeholders for these missing image manifests:

- `storefront.asset.json`
- `tonno.asset.json`
- `focaccia.asset.json`
- `slices.asset.json`
- `counter.asset.json`
- `oven.asset.json`
- `boxes.asset.json`

Restore the original manifests and their referenced image files to get the original
photos back. Each manifest must provide a `url` property pointing to an accessible
image. Existing manifests automatically take priority over placeholders. For a
self-contained ZIP, put photos in `public/images/` and use URLs such as
`/images/oven.jpg`; Vite copies these into the build output.

The placeholders also appear in exported previews until the originals are restored.
Google Fonts and external map links still require an internet connection.
