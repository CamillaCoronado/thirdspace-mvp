/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './src/**/*.{html,js,svelte,ts}',
    ],
    theme: {
      extend: {
        spacing: {
          '4': '4px',
          '8': '8px',
          '12': '12px',
          '16': '16px',
          '24': '24px',
          '32': '32px',
          '64': '64px',
        },
        width: {
          '28': '28px',
        },
        height: {
          '28': '28px',
        },
  
        backgroundImage: {
          'custom-gradient': 'linear-gradient(180deg, #C6FFDD 0%, #FBD786 25%, #F7797D 70%)',
        },
        colors: {
          // Light colors
          'color-white': '#FFFFFF',
          'light-green': '#F4FFF8',
          'light-gray': '#DFE0E0',
          'light-blue': '#E6EEFF',
          'secondary-light-gray': '#F0F4F2',
  
          // Medium colors
          'medium-yellow': '#FBD786',
          'medium-gray': '#ABB2AE',
          'medium-green': '#58D386',
          'medium-light-green': '#76EAA4',
  
          // Dark colors
          'dark-blue': '#3B5998',
          'dark-gray': '#959090',
          'dark-pink': '#F7797D',
          'dark-charcoal': '#484F4B',
          'dark-cobalt': '#5490FF',
          'dark-yellow': '#F7B011',
          'dark-red': '#D35858',
          'darker-yellow': '#FFCB56',
        },
      },
    plugins: [],
    }
  }
  