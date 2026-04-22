# Security Policy — zeqsdk-docs

This repository contains the **Docusaurus source** for the Zeq SDK documentation site and a **live snapshot** (`vps-live/`) of that site as served from **zeq.dev/sdk/**.

Even though the content is "just docs," a documentation site is a real security surface. It ships client-side JavaScript, it is linked to from the production domain, and it shapes how developers integrate with the Zeq OS Mathematical Framework. Security issues here are taken seriously.

---

## Scope — what this policy covers

This policy covers security issues in:

1. **`source/`** — the Docusaurus project.
   - Build tooling: `package.json`, `scripts/`, `tsconfig.json`.
   - Custom theme and page code in `source/src/`.
   - Content in `source/docs/` and `source/i18n/<locale>/` that contains executable examples.
   - Sidebar and navigation config (`source/sidebars.ts`).
2. **`vps-live/`** — the built snapshot.
   - `index.html`, `404.html`, `sitemap.xml`.
   - JS/CSS bundles under `vps-live/assets/`.
   - `vps-live/zeq-kernel-copy.js` — the in-page client-side kernel copy.
   - `vps-live/zeq-mobile-fix.css` — the shipped mobile fix.
3. **Cross-cutting issues** — any link, script tag or third-party asset loaded by the built site that creates a risk for readers.

The **live production site at `zeq.dev/sdk/`** shares a lineage with this repo. A bug reproducible on the live site should be reported through the support channel at [zeq.dev/pricing](https://zeq.dev/pricing) rather than as a public issue here.

---

## What counts as a security issue here

In-scope examples:

- **Cross-site scripting (XSS)** in any rendered page, whether from the source or the snapshot.
- **HTML or Markdown injection** in docs content or translation strings.
- **Prototype pollution, open-redirect or clickjacking** reachable through the built site.
- **Subresource integrity issues** — a third-party script, font or asset that is loaded without integrity protection in a way that exposes readers.
- **Sensitive data in docs** — a leaked token, internal-only URL, private endpoint or debug key accidentally committed to `source/` or present in `vps-live/`.
- **Malicious code in `zeq-kernel-copy.js`** or any other shipped asset.
- **Supply-chain issues** — a compromised dependency in `source/package.json` that reaches the built output.
- **Translation-vector attacks** — a translation string that, when rendered, produces a script, redirect or phishing vector.
- **Build-pipeline weaknesses** that let an external contributor inject content into the built site without review.

Out-of-scope examples:

- Requests to change the framework constants (1.287 Hz, 0.777 s, KO42, v1.287) "for safety." Those are license-fixed.
- Issues that depend on running a modified build locally with no path to production.
- Accessibility and spelling issues — valuable, but those belong in regular issues, not security reports.
- Generic opinions about Docusaurus defaults.

---

## How to report a vulnerability

**Do not** open a public GitHub issue for security reports.

Please use one of the following, in order of preference:

1. **GitHub Security Advisories** — open a private advisory on this repository via the *Security* tab → *Report a vulnerability*. This is the preferred channel.
2. **Support channel on zeq.dev** — contact via [zeq.dev/pricing](https://zeq.dev/pricing). Mark the message clearly as a security report for `hulyasmath/zeqsdk-docs`.

In your report, please include:

- The affected file(s) and path(s) (`source/…`, `vps-live/…`, or both).
- The affected page URL on the live site, if applicable.
- A clear description of the issue.
- Steps to reproduce, or a proof-of-concept.
- Your assessment of impact (who is affected, how).
- Whether the same issue reproduces on the live site at `zeq.dev/sdk/`.
- Any suggested remediation.

If the issue involves a specific translation, please also note:

- The locale code (`ar`, `de`, `es`, `fr`, `hi`, `it`, `ja`, `ko`, `pt-BR`, `ru`, `zh-Hans`).
- The specific translation string or file.
- Whether the English source is also affected.

---

## Our commitments

When you report a vulnerability we will:

1. Acknowledge receipt within **7 calendar days**.
2. Provide an initial assessment within **14 calendar days** (in scope / out of scope / needs more info).
3. Keep you updated on progress.
4. Coordinate disclosure timing — we will not disclose your report publicly before an agreed date.
5. Credit you in any advisory or changelog entry, unless you prefer to remain anonymous.

We ask that you:

- Give us a reasonable window before public disclosure (typically **90 days**, shorter if the issue is actively exploited).
- Do **not** test against the live production site at `zeq.dev` as part of your research on this archive — report and we will reproduce.
- Do **not** access, modify or exfiltrate data that does not belong to you.
- Do **not** run denial-of-service attacks, even as part of a proof-of-concept.

---

## Supported versions

| Component | Status |
|-----------|--------|
| `source/` (current `main`) | Actively maintained. Security reports accepted. |
| `vps-live/` (current `main`) | Regenerated from source. Security reports accepted against the shipped bundles. |
| Older commits | Not supported. If you find an issue, check it still reproduces on `main` before reporting. |

For the live production site, see [zeq.dev/sdk/](https://zeq.dev/sdk/) and report through [zeq.dev/pricing](https://zeq.dev/pricing).

---

## Content integrity

Because these docs teach developers how to use the framework, content-integrity reports are in scope:

- Code samples that intentionally or accidentally teach insecure patterns.
- Translation strings that change the meaning of security-relevant prose (for example, turning a "don't do this" warning into a "do this" instruction).
- Pages that quietly claim behaviour the SDK does not actually provide.
- Divergence between `source/` and `vps-live/` that looks deliberate rather than accidental.

Send these through the same private channels as any other security report.

---

## Framework integrity

The framework constants are part of the licensed behaviour of the system:

- **HulyaPulse = 1.287 Hz**
- **Zeqond = 0.777 s**
- **Precision = ≤ 0.1 %**
- **Metric Tensioner = KO42**, ZEQ Framework v1.287

If you find docs content — in any locale — that misrepresents any of these values, that is in scope as an integrity report. Docs that erode the fixed framework are not "just wrong"; they are a vector.

---

## Citation

- **HULYAS ZEQ Framework** — DOI: `10.5281/zenodo.15825138`
- **Zeq Paper** — DOI: `10.5281/zenodo.18158152`

---

*Security here means the docs teach what the framework actually is — no more, no less, in any of 11 languages.*
———✅❌—————————————————
