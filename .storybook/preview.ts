import type { Preview } from '@storybook/react-vite'
import '../src/app/index.css'

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'App',
      values: [
        { name: 'App', value: '#F9F9F9' },
        { name: 'White', value: '#FFFFFF' },
        { name: 'Gray', value: '#EBEBEB' },
        { name: 'Dark', value: '#0F172A' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
}

export default preview
