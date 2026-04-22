# Contributing to zeqsdk-docs

Thank you for helping improve the Zeq SDK documentation.

This repository has two parts and contributions look different for each:

- **`source/`** — the Docusaurus source. This is where almost all content and translation work happens.
- **`vps-live/`** — a snapshot of the built site at **zeq.dev/sdk/**. This is **not** hand-edited; it is regenerated from the source and deployment.

Please read this file in full before opening a PR that touches either.

---

## Ground rules

Before anything else:

- Read and agree with [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).
- Read and agree with [`LICENSE`](LICENSE) — **THE 1.287 HULYAS ZEQ Public License (1.287HZ) v1.287**.

The framework constants are fixed by license and are **not** editable through documentation changes:

- **HulyaPulse = 1.287 Hz**
- **Zeqond = 0.777 s**
- **Precision = ≤ 0.1 %**
- **Metric Tensioner = KO42**, ZEQ Framework v1.287

A PR whose effect is to suggest these values are negotiable will be closed.

---

## Types of contribution we welcome

1. **Accuracy fixes** — correcting wrong code samples, wrong endpoint signatures, wrong numerical examples, or wrong framework explanations in `source/docs/`.
2. **Clarity improvements** — rewording, restructuring or reordering existing pages to make them easier to read. One page per PR is the sweet spot.
3. **New guides and walkthroughs** — added under `source/docs/guides/` or `source/docs/learn/` with a clear "what will the reader be able to do after this page" intro.
4. **Translations and translation corrections** — across any of the 11 locales in `source/i18n/` (see below).
5. **Sidebar and navigation fixes** — to `source/sidebars.ts` when pages move or are added.
6. **Build and tooling fixes** — to `source/package.json`, `source/scripts/` and `source/tsconfig.json` when they break.
7. **Reports of drift** between `source/` built output and `vps-live/` — these are valuable even without a fix.

What we **don't** accept:

- Hand edits to `vps-live/`. That directory is regenerated.
- Changes that alter framework constants.
- "Rewrite the whole SDK reference" mega-PRs. Break them up.
- Content that is not grounded in the actual SDK surface. If the SDK does not do it, the docs do not promise it.

---

## Working with `source/` (Docusaurus)

### First-time setup

```bash
cd source
npm install
```

### Live preview

```bash
npm run start
```

This launches a local dev server. Edit files under `source/docs/` or `source/i18n/<locale>/` and the page will hot-reload.

### Full build

```bash
npm run build
```

This produces a static build of the site. A clean build should be functionally equivalent to `vps-live/` modulo content-hash filenames on bundled assets.

### Page structure

- Every page under `source/docs/` must have proper front matter (`id`, `title`, optionally `sidebar_label` and `description`).
- Code samples must run. If a sample needs an API key, show a placeholder and explain where to get a real one (link: [zeq.dev/pricing](https://zeq.dev/pricing)).
- Cross-links use Docusaurus relative syntax so they keep working across versions and locales.
- When adding or renaming a page, update `source/sidebars.ts` in the same PR.

### Images and static assets

- Drop site-wide images in `source/static/img/` and reference them with an absolute path (`/img/foo.png`).
- Keep image files reasonably small; avoid uncompressed multi-megabyte PNGs.

---

## Translations (`source/i18n/`)

`source/i18n/` contains translations for:

- `ar/` — Arabic
- `de/` — German
- `es/` — Spanish
- `fr/` — French
- `hi/` — Hindi
- `it/` — Italian
- `ja/` — Japanese
- `ko/` — Korean
- `pt-BR/` — Brazilian Portuguese
- `ru/` — Russian
- `zh-Hans/` — Simplified Chinese

### Translation rules

- Translate **meaning**, not words. Literal transliteration is not acceptable when it makes the SDK harder to understand.
- **Do not translate** framework constants (`1.287 Hz`, `0.777 s`, `KO42`, `v1.287`), operator names, code identifiers, SDK method names, or URLs.
- Translate the **prose around** those constants so the text is natural in the target language.
- Keep the file structure mirrored: a translated page lives at the same path inside its locale as the English original.
- Mark pages that are out of date or only partially translated so readers know.

### Review of translations

Translation PRs are reviewed by a maintainer familiar with the language when possible. Reviewers:

- Check correctness against the English source.
- Check that no framework constants or code identifiers have been altered.
- Respect the translator's stylistic choices; style is not a defect.

---

## Working with `vps-live/`

`vps-live/` is a snapshot of `zeq.dev/sdk/`. Please do **not** send PRs that edit files inside it.

If you find an issue in `vps-live/`, open an issue explaining:

- The page URL path (inside `vps-live/`).
- What is wrong.
- Whether the same issue appears on the live site at `zeq.dev/sdk/`.
- Whether the same issue appears in a fresh build of `source/`.

If the issue is only in `vps-live/` and not in `source/` or the live site, the snapshot is out of date and will be refreshed.

`zeq-kernel-copy.js` and `zeq-mobile-fix.css` are part of the built site and should be treated the same as any other `vps-live/` file — no hand edits.

---

## Before you open a PR

1. **Open an issue first** for anything non-trivial (new guides, structural changes, cross-locale work). Quick typo fixes can go straight to PR.
2. **Preview locally** with `npm run start`. Never send a PR whose page crashes the dev server.
3. **Check links** — broken internal links are the main cause of doc regressions.
4. **Check code samples** — run them or mark them as non-executable if they are deliberately illustrative.
5. **One logical change per PR.** Small PRs are merged faster and are easier to translate afterwards.

---

## Commit messages and PR hygiene

- Use imperative commit messages: `Fix wrong endpoint path in sdk/quickstart` rather than `fixes`.
- Reference the issue number (`Fixes #42`) where applicable.
- For translation PRs, include the locale in the subject: `[i18n/fr] Fix typo in core-concepts/pulse`.

---

## Communication

- General support and pricing: [zeq.dev/pricing](https://zeq.dev/pricing).
- Doc bugs, content gaps, translation issues: GitHub issues on this repo.
- Security issues: see [`SECURITY.md`](SECURITY.md) — do **not** open a public issue.

---

## Citation

If your contribution or downstream use relies on the framework or these docs, please cite:

- **HULYAS ZEQ Framework** — DOI: `10.5281/zenodo.15825138`
- **Zeq Paper** — DOI: `10.5281/zenodo.18158152`

---

*Good docs are a contribution in themselves. Thank you for making these better.*
———§§————————→→——
