import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Zeq SDK",
  tagline:
    "236 protocols. 64 domains. 1,576 operators. One API. Phase-locked to 1.287 Hz.",
  favicon: "img/favicon.svg",

  url: "https://www.zeq.dev",
  baseUrl: "/sdk/",

  organizationName: "zeq-os",
  projectName: "zeq-sdk-docs",

  // Loaded on every page so the Copy widget can mount wherever
  // <div id="zeq-kernel-copy-mount"></div> is placed.
  scripts: [
    { src: "/sdk/zeq-kernel-copy.js", async: true },
  ],

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  markdown: {
    format: "md", // Use plain Markdown, not MDX — avoids JSX parsing of {curly braces} in equations
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en","ar","zh-Hans","es","fr","de","pt-BR","ja","ko","ru","hi","it"],
    localeConfigs: {
      en: { label: "English" },
      ar: { label: "العربية", direction: "rtl" },
      "zh-Hans": { label: "简体中文" },
      es: { label: "Español" },
      fr: { label: "Français" },
      de: { label: "Deutsch" },
      "pt-BR": { label: "Português" },
      ja: { label: "日本語" },
      ko: { label: "한국어" },
      ru: { label: "Русский" },
      hi: { label: "हिन्दी" },
      it: { label: "Italiano" },
    },
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/hulyasmath/zeqsdk/tree/main/artifacts/docs/",
          showLastUpdateTime: false,
          routeBasePath: "/", // Docs are the landing page
        },
        blog: false, // No blog — SDK docs only
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/og-image.png",
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Zeq SDK",
      logo: {
        alt: "Zeq",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "learnSidebar",
          position: "left",
          label: "Learn",
        },
        {
          type: "docSidebar",
          sidebarId: "buildSidebar",
          position: "left",
          label: "Build",
        },
        {
          type: "docSidebar",
          sidebarId: "referenceSidebar",
          position: "left",
          label: "Reference",
        },
        {
          type: "docSidebar",
          sidebarId: "operateSidebar",
          position: "left",
          label: "Operate",
        },
        {
          to: "/build/clients/languages",
          label: "Languages",
          position: "left",
        },
        {
          to: "/operate/compliance",
          label: "Compliance",
          position: "left",
          className: "navbar-compliance-link",
        },
        {
          href: "https://zeq.dev/state/",
          label: "Zeq State",
          position: "right",
          className: "navbar-zeqstate-link",
        },
        {
          href: "https://zeq.dev/pricing",
          label: "Pricing",
          position: "right",
        },
        {
          href: "https://zeq.dev",
          label: "zeq.dev",
          position: "right",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "SDK",
          items: [
            { label: "Quick Start", to: "/build/quickstart/introduction" },
            { label: "Core Concepts", to: "/learn/concepts/hulyapulse" },
            { label: "Protocol Reference", to: "/reference/protocols" },
          ],
        },
        {
          title: "Guides",
          items: [
            { label: "Medical Imaging", to: "/build/recipes/medical-imaging" },
            { label: "Game Physics", to: "/build/recipes/game-physics" },
            { label: "Emergency Systems", to: "/build/recipes/emergency-systems" },
          ],
        },
        {
          title: "Resources",
          items: [
            {
              label: "Zeq Paper (DOI)",
              href: "https://doi.org/10.5281/zenodo.18158152",
            },
            {
              label: "Framework Paper (DOI)",
              href: "https://doi.org/10.5281/zenodo.15825138",
            },
            { label: "HULYAS.org", href: "https://hulyas.org" },
          ],
        },
        {
          title: "Ecosystem",
          items: [
            { label: "zeq.dev — Developer SDK", href: "https://zeq.dev" },
            { label: "zeq.me — Apps & Ecosystem", href: "https://zeq.me" },
            { label: "HulyaPulse.com — The Frequency", href: "https://hulyapulse.com" },
            { label: "1.287.com — The Discovery & Architecture", href: "https://1.287.com" },
            { label: "Zeqond.com — The 0.777 Clock Cycle", href: "https://zeqond.com" },
            { label: "Hulyas.org — Foundation", href: "https://hulyas.org" },
            { label: "GitHub — hulyasmath", href: "https://github.com/hulyasmath" },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Zeq 1.287 Hz Limited. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        "bash",
        "json",
        "python",
        "go",
        "rust",
        "java",
        "csharp",
        "ruby",
        "php",
      ],
    },
    algolia: undefined, // Add later when search is needed
  } satisfies Preset.ThemeConfig,
};

export default config;
