# zeqsdk-docs

**The public source and snapshot of the Zeq SDK documentation site.**

This repository holds two things side-by-side:

1. **`source/`** — the Docusaurus source that builds the live documentation site at [**zeq.dev/sdk/**](https://zeq.dev/sdk/).
2. **`vps-live/`** — a static snapshot of the built site as it is actually served from the VPS at `zeq.dev/sdk/` at the time of snapshot.

Having both together means:

- Anyone can read the docs without running a build.
- Anyone can rebuild the docs from source and compare against what is live.
- The site is not a black box — what you see at `zeq.dev/sdk/` is what is in this repo.

This repo is part of the Zeq OS Mathematical Framework — **1.287 Hz HulyaPulse**, **Zeqond = 0.777 s**, **≤0.1% precision**, **KO42 Metric Tensioner** (ZEQ Framework v1.287).

---

## Why this repo exists

The Zeq SDK is the developer surface for the live framework. Documentation for that SDK has to be:

- **Authoritative** — the same content the production site serves.
- **Auditable** — buildable from source, verifiable against the live snapshot.
- **Translatable** — usable by developers in multiple languages.
- **Preservable** — if `zeq.dev/sdk/` is ever unreachable, the docs still exist here.

This repository exists to make all four of those true at once.

---

## Repository layout

```
zeqsdk-docs/
├── source/                         # Docusaurus source (builds zeq.dev/sdk/)
│   ├── docs/                       # Markdown/MDX content
│   │   ├── index.md                # Site landing
│   │   ├── changelog.md            # SDK changelog
│   │   ├── getting-started/        # Install, first call, quickstart
│   │   ├── core-concepts/          # Framework concepts (pulse, zeqond, operators)
│   │   ├── sdk/                    # SDK surface reference
│   │   ├── api-reference/          # API endpoints
│   │   ├── guides/                 # Task-based how-tos
│   │   ├── learn/                  # Longer-form learning material
│   │   ├── operate/                # Operator-level documentation
│   │   ├── protocols/              # Protocol-level documentation
│   │   └── reference/              # Reference tables and specs
│   ├── i18n/                       # Translations for 11 locales
│   │   ├── ar/                     # Arabic
│   │   ├── de/                     # German
│   │   ├── es/                     # Spanish
│   │   ├── fr/                     # French
│   │   ├── hi/                     # Hindi
│   │   ├── it/                     # Italian
│   │   ├── ja/                     # Japanese
│   │   ├── ko/                     # Korean
│   │   ├── pt-BR/                  # Portuguese (Brazil)
│   │   ├── ru/                     # Russian
│   │   └── zh-Hans/                # Simplified Chinese
│   ├── src/                        # Theme, components, custom pages
│   ├── static/                     # Static assets served as-is
│   ├── scripts/                    # Build/translation helper scripts
│   ├── sidebars.ts                 # Sidebar structure
│   ├── package.json                # Docusaurus toolchain pinning
│   ├── tsconfig.json               # TS config
│   ├── README.md                   # Source-side README
│   ├── DOCUMENTATION_SUMMARY.md    # Content inventory
│   └── FILES_CREATED.txt           # File ledger
│
├── vps-live/                       # Static snapshot of zeq.dev/sdk/
│   ├── index.html                  # Site entry
│   ├── 404.html                    # Not-found page
│   ├── sitemap.xml                 # Full sitemap
│   ├── assets/                     # Hashed JS/CSS bundles
│   ├── img/                        # Site images
│   ├── changelog/                  # Built changelog pages
│   ├── learn/                      # Built learn section
│   ├── operate/                    # Built operate section
│   ├── protocols/                  # Built protocols section
│   ├── reference/                  # Built reference section
│   ├── zeq-kernel-copy.js          # In-site kernel copy (client)
│   └── zeq-mobile-fix.css          # Mobile layout fix
│
├── .github/                        # GitHub metadata (funding, etc.)
├── .gitignore
├── LICENSE                         # THE 1.287 HULYAS ZEQ Public License (1.287HZ) v1.287
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── SECURITY.md
└── README.md                       # ← you are here
```

---

## `source/` — the Docusaurus site

`source/` is a standard Docusaurus project. It is the canonical input to `zeq.dev/sdk/`.

### Toolchain

- **Docusaurus** — static-site generator.
- **TypeScript** — for `sidebars.ts` and theme code.
- **Node.js** — per `package.json` engine pin.

### Content taxonomy

The `docs/` tree is organised into the sections a framework SDK actually needs:

- **getting-started/** — install the SDK, make a first call, verify a coherence pulse.
- **core-concepts/** — what 1.287 Hz HulyaPulse, 0.777 s Zeqond, KO42 and the operator model mean.
- **sdk/** — the SDK surface as a developer sees it.
- **api-reference/** — endpoint-level reference.
- **guides/** — task-oriented walkthroughs.
- **learn/** — deeper educational material.
- **operate/** — operator-level documentation.
- **protocols/** — protocol-level documentation.
- **reference/** — stable reference tables and specs.
- **changelog.md** — SDK-visible changes.
- **index.md** — site landing.

### Internationalisation

`i18n/` contains translations for **11 locales**: Arabic, German, Spanish, French, Hindi, Italian, Japanese, Korean, Brazilian Portuguese, Russian, Simplified Chinese. Each locale mirrors the structure of `docs/` so the sidebar and routing work identically in every language.

### Building locally

```bash
cd source
npm install
npm run start   # local dev server
npm run build   # produces a static build equivalent to vps-live/
```

The build output is what `zeq.dev/sdk/` serves. A fresh build should be byte-close to `vps-live/` modulo hash fingerprints on bundled assets.

---

## `vps-live/` — the live snapshot

`vps-live/` is a direct snapshot of `zeq.dev/sdk/` as served from production at the time of the snapshot. It includes:

- **`index.html`** — the SDK site entry page.
- **`404.html`** — the not-found page.
- **`sitemap.xml`** — the complete sitemap of `zeq.dev/sdk/`.
- **`assets/`** — hashed JS and CSS bundles emitted by the Docusaurus build.
- **`img/`** — site imagery.
- **`changelog/`, `learn/`, `operate/`, `protocols/`, `reference/`** — pre-rendered section trees.
- **`zeq-kernel-copy.js`** — an in-page client-side copy of the kernel wiring used by the site.
- **`zeq-mobile-fix.css`** — the mobile layout fix shipped with the site.

This snapshot is *not* edited by hand. It is regenerated from `source/` and the live deployment and committed as a reference.

---

## The Zeq OS Mathematical Framework

Everything the SDK exposes is phase-locked to:

| Constant | Value | Meaning |
|----------|-------|---------|
| HulyaPulse | **1.287 Hz** | Fundamental oscillation frequency |
| Zeqond | **0.777 s** | Golden ratio-based time unit |
| Precision | **≤ 0.1 %** | Required verification tolerance |
| Metric Tensioner | **KO42** | ZEQ Framework v1.287 |

Documentation that implies these values are negotiable is, by definition, wrong. The docs mirror the framework; the framework does not mirror the docs.

---

## Relationship to the live system

- **Live docs site:** [zeq.dev/sdk/](https://zeq.dev/sdk/)
- **Pricing / subscription / support:** [zeq.dev/pricing](https://zeq.dev/pricing)
- **This repo:** both the Docusaurus source that produces the live site and a verifiable snapshot of it.

If the site at `zeq.dev/sdk/` ever disagrees with a fresh build of `source/`, that is a bug and should be reported.

---

## Citation

If you use the SDK, the framework, or this documentation in academic or published work, please cite:

- **HULYAS ZEQ Framework** — DOI: `10.5281/zenodo.15825138`
- **Zeq Paper** — DOI: `10.5281/zenodo.18158152`

```
Hulya Ozdemir. HULYAS ZEQ Framework. Zenodo. DOI: 10.5281/zenodo.15825138
Hulya Ozdemir. Zeq Paper. Zenodo. DOI: 10.5281/zenodo.18158152
```

---

## Subscription

Support, pricing and subscription options are available at **[zeq.dev/pricing](https://zeq.dev/pricing)**.

---

## License

This repository is released under **THE 1.287 HULYAS ZEQ Public License (1.287HZ) v1.287**.

See [`LICENSE`](LICENSE) for the full terms. The framework constants (1.287 Hz HulyaPulse, 0.777 s Zeqond, KO42 Metric Tensioner, ZEQ Framework v1.287) are not modifiable under this license.

---

## Community

- [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) — expected conduct when contributing.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — how to contribute docs, translations, or snapshot fixes.
- [`SECURITY.md`](SECURITY.md) — how to report a security issue in the docs or built site.

---

*Source in, site out, snapshot preserved — the docs are the framework, visible.*
