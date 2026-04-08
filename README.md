# zeqsdk-docs

Source + live snapshot of **https://zeq.dev/sdk/** (Zeq SDK Docusaurus site).

## Layout

- `source/` — Docusaurus project (`docusaurus.config.ts`, `sidebars.ts`, `docs/`, `src/`, `static/`, `scripts/`). Run `npm install && npm run build` here to rebuild.
- `vps-live/` — exact rsync snapshot of `/var/www/zeqsdk-docs/` on `135.181.76.66` as of 2026-04-08, including in-place fixes (kernel-copy widget patch, mobile-sidebar fix, cache-busts).

## Build

    cd source
    npm install
    npm run build         # outputs to source/build/
    rsync -a build/ root@135.181.76.66:/var/www/zeqsdk-docs/

## Known gaps in this initial import

78 markdown files in `source/docs/` (under `learn/concepts/`, `guides/`, `reference/operators/`) failed to copy from the local Mac source — every read attempt hangs indefinitely. Suspected cause: filesystem lock or iCloud Drive placeholder. The fully-rendered HTML for all of them is in `vps-live/` so the live site is unaffected; recovery from `vps-live` HTML or a fresh Finder download is the next step.
