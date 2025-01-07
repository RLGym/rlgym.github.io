// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const math = require('remark-math');
const katex = require('rehype-katex');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'RLGym',
  tagline: 'A Python API for Reinforcement Learning Environments',
  url: 'https://rlgym.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'RLGym',
  projectName: 'rlgym.github.io-docusaurus',

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [math],
          rehypePlugins: [katex],
          routeBasePath: '/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/RLGym/rlgym.github.io-docusaurus/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
    {
      href: '/katex/katex.min.css',
      type: 'text/css',
    },
  ],

  plugins: [
    'docusaurus-plugin-sass',
    [
      require.resolve("@cmfcmf/docusaurus-search-local"),
      {
        indexDocs: true,
        indexBlog: true,
        indexPages: true,
        language: "en"
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'RLGym',
        logo: {
          alt: 'RLGym Logo',
          src: 'img/rlgym-logo.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'Getting Started/introduction',
            position: 'left',
            label: 'Introduction',
          },
          {
            type: 'doc',
            docId: 'RLGym Tools/introduction',
            position: 'left',
            label: 'RLGym Tools',
          },
          {
            type: 'doc',
            docId: 'RLGym Learn/introduction',
            label: 'RLGym Learn',
            position: 'left',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://captainglac1er.github.io/rocket-league-gym/',
            label: 'API Reference',
            position: 'left',
          },
          {
            href: 'https://pypi.org/project/rlgym/',
            label: 'Download',
            position: 'right',
            className: 'navbar-download-button',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: ' ',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/NjAHcP32Ae',
                type: 'discord',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/RLGymOfficial',
                type: 'twitter',
              },
              {
                label: 'Twitch',
                href: 'https://twitch.tv/RLGym',
                type: 'twitch',
              },
              {
                label: 'Patreon',
                href: 'https://patreon.com/rlgym',
                type: 'patreon',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/lucas-emery/rocket-league-gym',
                type: 'github',
              },
              {
                label: 'Pip',
                href: 'https://pypi.org/project/rlgym/',
                type: 'pip',
              }
            ],
          },
        ],
        copyright: `Copyright ${new Date().getFullYear()}`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
    }),
};

module.exports = config;
