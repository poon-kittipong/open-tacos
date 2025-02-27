const defaultTheme = require('tailwindcss/defaultTheme')

// See https://tailwindcss.com/docs/configuration for details
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],

  // https://github.com/tailwindlabs/tailwindcss-forms
  plugins: [require('daisyui'), require('@tailwindcss/typography'), require('tailwindcss-radix')()],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ISO', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        'custom-green': '#8BB191',
        'ob-primary': '#F15E40',
        'ob-secondary': '#8BB191',
        'ob-tertiary': '#62cae3',
        'ob-dark': '#0f172a', // slate-900
        'custom-secondary': '#62cae3',
        'custom-avery': '#a5d9cf',
        'custom-primary': '#F07933'
      },
      height: {
        'screen-85': '85vh',
        'screen-80': '80vh',
        'screen-20': '20vh',
        'screen-15': '15vh'
      },
      screens: {
        '3xl': '2560px'
      }
    }
  },
  daisyui: {
    styled: true,
    themes: [{
      light: {
        ...require('daisyui/src/colors/themes')['[data-theme=light]'],
        primary: '#111827',
        'primary-content': '#ffffff',
        secondary: '#b1c077', // OB brand secondary
        accent: '#F15E40', // OB primary brand
        neutral: '#111826',
        info: '#65C3C8',
        'base-content': '#111827', // gray-900
        'base-300': '#4B5563', // gray-600
        'base-200': '#E5E7EB', // gray-200
        'base-100': '#ffffff', // white
        '--rounded-box': '0.5rem',
        '--btn-text-case': s => s
      }
    }],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: ''
  }
}
