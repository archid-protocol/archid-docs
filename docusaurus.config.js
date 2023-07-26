// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ArchID Docs',
  tagline: 'More than an address',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.archid.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // Link linting
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/archid-protocol/archid-docs',
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
      image: 'img/archprint.svg',
      navbar: {
        title: 'ArchID',
        logo: {
          alt: 'More than a name, an identity',
          src: 'img/token.svg',
        },
        items: [
          {
            position: 'left',
            label: 'Overview',
            to: '/docs/start',
          },
          {
            position: 'left',
            label: 'Contracts',
            to: '/docs/contracts/intro',
          },
          {
            position: 'left',
            label: 'Dapps',
            to: '/docs/dapps/intro',
          },
          {
            href: 'https://github.com/archid-protocol',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/intro',
              },
              {
                label: 'Smart Contracts',
                to: 'docs/contracts/intro'
              },
              {
                label: 'Dapps',
                to: 'docs/dapps/intro'
              }
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/archid-protocol',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/ghCCDu3dPB',
              },
              {
                label: 'X',
                href: 'https://twitter.com/archidapp',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Dev Updates',
                to: 'https://medium.com/@archid.protocol',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/archid-protocol',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} ArchID.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      // prism: {
      //   theme: require('prism-react-renderer/themes/dracula'),
      // },
    }),
};

module.exports = config;
