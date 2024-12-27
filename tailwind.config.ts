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
        colors: {
          // Light colors
        'color-white': '#FFFFFF',
        'light-gray': '#F3F1F5',
       

        // Medium colors
        'pink': '#CD93F1',
        'medium-indigo': '#7065DF',
        'medium-gray' : '#8D8B90',
        'fb-blue': '#3B5998',
        'g-blue': '#4485F5',

        // Dark colors
        'indigo': '#6A2AF8',
        'dark-gray': '#8D8B90',
        'dark-charcoal': '#4D4A54',

        //error and function 
        'red': "#FE1D0E",
        },
      },
    plugins: [],
    }
  }
  