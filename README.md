# zeqsdk-docs

Private source + live snapshot of **https://zeq.dev/sdk/** — the Zeq SDK Docusaurus site.

## Layout

- **`source/`** — editable Docusaurus project. Source of truth for every SDK page.
  - `docusaurus.config.ts`, `sidebars.ts`, `package.json`, `tsconfig.json`
  - `docs/` — 404 markdown files (learn, guides, protocols, reference, concepts, api-reference, getting-started, sdk, operate, core-concepts, changelog)
  - `src/`, `static/`, `scripts/`
- **`vps-live/`** — point-in-time rsync snapshot of `/var/www/zeqsdk-docs/` on `135.181.76.66`. Contains the rendered HTML + all in-place runtime fixes (kernel-copy widget patch, mobile-sidebar fix, cache-busted script tags). Useful for diffing against future rebuilds.

## Build locally

    cd source && npm install && npm run build

## Deploy to VPS

    cd source && npm run build
    rsync -az --delete build/ root@135.181.76.66:/var/www/zeqsdk-docs/

## Current Docusaurus flags (future edits)

- `colorMode.disableSwitch: true` — light/dark toggle currently OFF
- `i18n.locales: ['en']` — only English configured

## Notes

In-place VPS edits made before this import are preserved in `vps-live/` and should be folded back into `source/` before the next rebuild so the source generates a matching output.
