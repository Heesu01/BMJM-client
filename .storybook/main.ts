import type { StorybookConfig } from '@storybook/react-vite'
import { resolve } from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },

  viteFinal: async (cfg) => {
    const [{ default: tailwindcss }, { default: svgr }] = await Promise.all([
      import('@tailwindcss/vite'),
      import('vite-plugin-svgr'),
    ])

    cfg.plugins = [
      ...(cfg.plugins || []),
      tailwindcss(),
      svgr({
        svgrOptions: {
          svgo: true,
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: { overrides: { removeViewBox: false } },
              },
            ],
          },
          replaceAttrValues: {
            '#000': 'currentColor',
            '#000000': 'currentColor',
          },
        },
      }),
    ]

    cfg.resolve = {
      ...(cfg.resolve || {}),
      alias: {
        ...(cfg.resolve?.alias || {}),
        '@': resolve(__dirname, '../src'),
      },
    }

    return cfg
  },
}

export default config
