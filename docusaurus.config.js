// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'The Rocket League Gym',
  tagline: 'A python API to treat the game Rocket League as an OpenAI Gym environment.',
  url: 'https://captainglac1er.github.io',
  baseUrl: '/rlgym.github.io/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  trailingSlash: true,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'RLGym', // Usually your GitHub org/user name.
  projectName: 'rlgym.github.io', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
      'docusaurus-plugin-sass',
    [
      require.resolve("@cmfcmf/docusaurus-search-local"),
      {
        // Options here
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'RLGym',
        logo: {
          alt: 'RLGym',
          src: 'img/rlgym-logo.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'introduction',
            position: 'left',
            label: 'Documentation',
          },
          {
            to: '/blog',
            label: 'Blog',
            position: 'left'
          },
          {
            type: 'html',
            position: 'right',
            value: '<a href="https://pypi.org/project/rlgym/" class="button button--primary">Download</a>',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Community',
            items: [
              {
                href: 'https://twitter.com/RLGymOfficial',
                label: 'Twitter'
              },
              {
                href: 'https://www.twitch.tv/rlgym',
                label: 'Twitch'
              },
              {
                href: 'https://www.youtube.com/channel/UCm5akawm2Bk0aMx2NbAPB3g',
                label: 'Youtube'
              },
              {
                href: 'https://discord.gg/zbaAKPt',
                label: 'Discord'
              }
            ],
          },
          {
            title: 'Contribute',
            items: [
              {
                label: 'GitHub - API',
                href: 'https://github.com/lucas-emery/rocket-league-gym',
              },
              {
                label: 'Github - Docs',
                href: 'https://github.com/RLGym/rlgym.github.io'
              }
            ],
          },
          {
            title: 'Support',
            items: [
              {
                href: 'https://www.patreon.com/RLGym',
                label: 'Patreon'
              }
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()}`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
