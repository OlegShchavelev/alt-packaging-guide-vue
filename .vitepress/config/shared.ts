import { defineConfigWithTheme } from 'vitepress'
import UnoCSS from 'unocss/vite'
import {
  GitChangelog,
  GitChangelogMarkdownSection
} from '@nolebase/vitepress-plugin-git-changelog/vite'
import markdownItTaskLists from 'markdown-it-task-lists'
import { tabsMarkdownPlugin as markdownItTabs } from 'vitepress-plugin-tabs'

export const shared = defineConfigWithTheme({
  srcDir: './docs',
  base: '/alt-packaging-guide-vue',
  cleanUrls: true,
  vite: {
    plugins: [
      UnoCSS(),
      GitChangelog({
        repoURL: () => 'https://github.com/SokolovValy/alt-packaging-guide-vue'
      }),
      GitChangelogMarkdownSection()
    ],
    optimizeDeps: {
      exclude: ['@nolebase/vitepress-plugin-enhanced-readabilities/client']
    },
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/ui'
      ]
    }
  },
  themeConfig: {
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3]
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/SokolovValy/alt-packaging-guide-vue'
      }
    ]
  },
  markdown: {
    container: {
      tipLabel: 'Подсказка',
      warningLabel: 'Внимание',
      dangerLabel: 'Осторожно',
      infoLabel: 'Информация',
      detailsLabel: 'Подробнее'
    },
    config: (md) => {
      md.use(markdownItTaskLists)
      md.use(markdownItTabs)
    }
  }
})
