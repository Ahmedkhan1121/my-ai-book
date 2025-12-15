// @ts-check
// `@ts-check` enables tsdoc standard typing for JS doc comments

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Physical AI & Humanoid Robotics — Essentials',
  tagline: 'A short, clean, professional AI-Native textbook',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://my-ai-book-two.vercel.app/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'your-organization', // Usually your GitHub org/user name.
  projectName: 'my-ai-book', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur'], // Adding Urdu for personalization feature
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
            'https://github.com/Ahmedkhan1121/my-ai-book/tree/main/frontend',
        },
        blog: false, // Disable blog for textbook
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'AI Textbook',
        logo: {
          alt: 'Textbook Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'textbookSidebar',
            position: 'left',
            label: 'Textbook',
          },
          {
            to: '/blog',
            label: 'Blog',
            position: 'left',
          },
          {
            to: '/ai-chatbot',
            label: 'AI Assistant',
            position: 'left',
          },
          {
            href: 'https://github.com/Ahmedkhan1121/my-ai-book.git',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Chapters',
            items: [
              {
                label: 'Introduction to Physical AI',
                to: '/docs/ch1-introduction-to-physical-ai',
              },
              {
                label: 'Basics of Humanoid Robotics',
                to: '/docs/ch2-basics-of-humanoid-robotics',
              },
              {
                label: 'ROS 2 Fundamentals',
                to: '/docs/ch3-ros-2-fundamentals',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'AI Assistant',
                to: '/ai-chatbot',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Ahmedkhan1121/my-ai-book.git',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics — Essentials. Built with Docusaurus.`,
      },
      prism: {
        // theme: require('prism-react-renderer/themes/github'),
        // darkTheme: require('prism-react-renderer/themes/dracula'),
      },
    }),

  // Custom scripts
  scripts: [],
};

module.exports = config;