import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Funabashi.dev",
  description: "船橋市を中心とした開発者コミュニティ",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'connpass', link: 'https://funabashidev.connpass.com' }
    ],

    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' },
    //     ]
    //   }
    // ],

    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/BhK2tpqQmn' }
    ]
  }
})
