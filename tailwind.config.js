module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{css}',
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: 'var(--typography-font-family-primary)',
        secondary: 'var(--typography-font-family-secondary)',
      },
      fontSize: {
        display: 'var(--typography-font-size-heading-display)',
        title: 'var(--typography-font-size-heading-title)',
        h1: 'var(--typography-font-size-heading-h1)',
        h2: 'var(--typography-font-size-heading-h2)',
        h3: 'var(--typography-font-size-heading-h3)',
        h4: 'var(--typography-font-size-heading-h4)',
        h5: 'var(--typography-font-size-heading-h5)',
        h6: 'var(--typography-font-size-heading-h6)',
        'body-xxl': 'var(--typography-font-size-body-body-xxl)',
        'body-xl': 'var(--typography-font-size-body-body-xl)',
        'body-lg': 'var(--typography-font-size-body-body-lg)',
        'body-md': 'var(--typography-font-size-body-body-md)',
        'body-sm': 'var(--typography-font-size-body-body-sm)',
        'body-xs': 'var(--typography-font-size-body-body-xs)',
      },
      fontWeight: {
        thin: 'var(--typography-font-weight-thin)',
        extralight: 'var(--typography-font-weight-extralight)',
        light: 'var(--typography-font-weight-light)',
        regular: 'var(--typography-font-weight-regular)',
        medium: 'var(--typography-font-weight-medium)',
        semibold: 'var(--typography-font-weight-semibold)',
        bold: 'var(--typography-font-weight-bold)',
        extrabold: 'var(--typography-font-weight-extrabold)',
        black: 'var(--typography-font-weight-black)',
      },
      lineHeight: {
        display: 'var(--typography-line-height-display)',
        title: 'var(--typography-line-height-title)',
        h1: 'var(--typography-line-height-h1)',
        h2: 'var(--typography-line-height-h2)',
        h3: 'var(--typography-line-height-h3)',
        h4: 'var(--typography-line-height-h4)',
        h5: 'var(--typography-line-height-h5)',
        h6: 'var(--typography-line-height-h6)',
        'body-xxl': 'var(--typography-line-height-body-xxl)',
        'body-xl': 'var(--typography-line-height-body-xl)',
        'body-lg': 'var(--typography-line-height-body-lg)',
        'body-md': 'var(--typography-line-height-body-md)',
        'body-sm': 'var(--typography-line-height-body-sm)',
        'body-xs': 'var(--typography-line-height-body-xs)',
      },
      padding: {
        none: 'var(--spacing-padding-none)',
        x: 'var(--spacing-padding-x)',
        '2x': 'var(--spacing-padding-2x)',
        '3x': 'var(--spacing-padding-3x)',
        '4x': 'var(--spacing-padding-4x)',
        '5x': 'var(--spacing-padding-5x)',
        '6x': 'var(--spacing-padding-6x)',
        '8x': 'var(--spacing-padding-8x)',
        '10x': 'var(--spacing-padding-10x)',
        '16x': 'var(--spacing-padding-16x)',
        '20x': 'var(--spacing-padding-20x)',
        'huge-x': 'var(--spacing-padding-huge-x)',
      },
      colors: {
        primary: {
          100: 'var(--typography-color-primary-100)',
          200: 'var(--typography-color-primary-200)',
          300: 'var(--typography-color-primary-300)',
          400: 'var(--typography-color-primary-400)',
          500: 'var(--typography-color-primary-500)',
          600: 'var(--typography-color-primary-600)',
          700: 'var(--typography-color-primary-700)',
          800: 'var(--typography-color-primary-800)',
          900: 'var(--typography-color-primary-900)',
          1000: 'var(--typography-color-primary-1000)',
        },
        secondary: {
          100: 'var(--typography-color-secondary-100)',
          200: 'var(--typography-color-secondary-200)',
          300: 'var(--typography-color-secondary-300)',
          400: 'var(--typography-color-secondary-400)',
          500: 'var(--typography-color-secondary-500)',
          600: 'var(--typography-color-secondary-600)',
          700: 'var(--typography-color-secondary-700)',
          800: 'var(--typography-color-secondary-800)',
          850: 'var(--typography-color-secondary-850)',
          900: 'var(--typography-color-secondary-900)',
          950: 'var(--typography-color-secondary-950)',
          1000: 'var(--typography-color-secondary-1000)',
        },
        status: {
          success: 'var(--typography-color-status-success)',
          warning: 'var(--typography-color-status-warning)',
          alert: 'var(--typography-color-status-alert)',
          acknowledged: 'var(--typography-color-status-ackowledeged)',
        },
        link: 'var(--typography-color-link-link)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
            opacity: '0',
            paddingTop: '0',
            paddingBottom: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
            opacity: '1',
            paddingTop: '0',
            paddingBottom: '20px',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
            opacity: '1',
            paddingTop: '0',
            paddingBottom: '20px',
          },
          to: {
            height: '0',
            opacity: '0',
            paddingTop: '0',
            paddingBottom: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'accordion-up': 'accordion-up 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      screens: {
        xs: { max: '375px' }, // ≤ 375px (small phones)
        sm: { max: '640px' }, // ≤ 640px (large phones)
        md: { max: '768px' }, // ≤ 768px (tablets)
        lg: { max: '1024px' }, // ≤ 1024px (small laptops)
        xl: { max: '1280px' }, // ≤ 1280px (desktops)
        '2xl': { max: '1536px' }, // ≤ 1536px (large screens)
        '3xl': { max: '5920px' }, // ≤ 1920px (extra large screens)
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        // Heading Styles
        '.text-display': {
          'font-family': 'var(--typography-font-family-primary)',
          'font-size': 'var(--typography-font-size-heading-display)',
          'font-weight': 'var(--typography-font-weight-regular)',
          'line-height': 'var(--typography-line-height-display)',
        },
        '.text-title': {
          'font-family': 'var(--typography-font-family-primary)',
          'font-size': 'var(--typography-font-size-heading-title)',
          'font-weight': 'var(--typography-font-weight-regular)',
          'line-height': 'var(--typography-line-height-title)',
        },
        '.text-heading-1': {
          'font-family': 'var(--typography-font-family-primary)',
          'font-size': 'var(--typography-font-size-heading-h1)',
          'font-weight': 'var(--typography-font-weight-regular)',
          'line-height': 'var(--typography-line-height-h1)',
        },
        '.text-heading-2': {
          'font-family': 'var(--typography-font-family-primary)',
          'font-size': 'var(--typography-font-size-heading-h2)',
          'font-weight': 'var(--typography-font-weight-regular)',
          'line-height': 'var(--typography-line-height-h2)',
        },
        '.text-heading-3': {
          'font-family': 'var(--typography-font-family-primary)',
          'font-size': 'var(--typography-font-size-heading-h3)',
          'font-weight': 'var(--typography-font-weight-regular)',
          'line-height': 'var(--typography-line-height-h3)',
        },
        '.text-heading-4': {
          'font-family': 'var(--typography-font-family-secondary)',
          'font-size': 'var(--typography-font-size-heading-h4)',
          'font-weight': 'var(--typography-font-weight-regular)',
          'line-height': 'var(--typography-line-height-h4)',
        },
        '.text-heading-5': {
          'font-family': 'var(--typography-font-family-secondary)',
          'font-size': 'var(--typography-font-size-heading-h5)',
          'font-weight': 'var(--typography-font-weight-regular)',
          'line-height': 'var(--typography-line-height-h5)',
        },
        '.text-heading-6': {
          'font-family': 'var(--typography-font-family-secondary)',
          'font-size': 'var(--typography-font-size-heading-h6)',
          'font-weight': 'var(--typography-font-weight-medium)',
          'line-height': 'var(--typography-line-height-h6)',
        },
        // Body Text Styles
        '.text-xxl-medium': {
          'font-family': 'var(--typography-font-family-secondary)',
          'font-size': 'var(--typography-font-size-body-body-xxl)',
          'font-weight': 'var(--typography-font-weight-medium)',
          'line-height': 'var(--typography-line-height-body-xxl)',
        },
        '.text-xxl-regular': {
          'font-family': 'var(--typography-font-family-secondary)',
          'font-size': 'var(--typography-font-size-body-body-xxl)',
          'font-weight': 'var(--typography-font-weight-regular)',
          'line-height': 'var(--typography-line-height-body-xxl)',
        },
        '.text-xxl-bold': {
          'font-family': 'var(--typography-font-family-secondary)',
          'font-size': 'var(--typography-font-size-body-body-xxl)',
          'font-weight': 'var(--typography-font-weight-bold)',
          'line-height': 'var(--typography-line-height-body-xxl)',
        },
        '.text-xl-med': {
          'font-family': 'var(--typography-font-family-secondary)',
          'font-size': 'var(--typography-font-size-body-body-xl)',
          'font-weight': 'var(--typography-font-weight-medium)',
          'line-height': 'var(--typography-line-height-body-xl)',
        },
        '.text-xl-regular': {
          'font-family': 'var(--typography-font-family-secondary)',
          'font-size': 'var(--typography-font-size-body-body-xl)',
          'font-weight': 'var(--typography-font-weight-regular)',
          'line-height': 'var(--typography-line-height-body-xl)',
        },
        '.text-xl-bold': {
          'font-family': 'var(--typography-font-family-secondary)',
          'font-size': 'var(--typography-font-size-body-body-xl)',
          'font-weight': 'var(--typography-font-weight-bold)',
          'line-height': 'var(--typography-line-height-body-xl)',
        },
        '.text-lg-regular': {
          'font-family': 'var(--typography-font-family-secondary)',
          'font-size': 'var(--typography-font-size-body-body-lg)',
          'font-weight': 'var(--typography-font-weight-regular)',
          'line-height': 'var(--typography-line-height-body-lg)',
        },
        '.text-lg-med': {
          'font-family': 'var(--typography-font-family-secondary)',
          'font-size': 'var(--typography-font-size-body-body-lg)',
          'font-weight': 'var(--typography-font-weight-medium)',
          'line-height': 'var(--typography-line-height-body-lg)',
        },
        '.text-lg-bold': {
          'font-family': 'var(--typography-font-family-secondary)',
          'font-size': 'var(--typography-font-size-body-body-lg)',
          'font-weight': 'var(--typography-font-weight-bold)',
          'line-height': 'var(--typography-line-height-body-lg)',
        },
        '.text-md-regular': {
          'font-family': 'var(--typography-font-family-secondary)',
          'font-size': 'var(--typography-font-size-body-body-md)',
          'font-weight': 'var(--typography-font-weight-regular)',
          'line-height': 'var(--typography-line-height-body-md)',
        },
        '.text-md-bold': {
          'font-family': 'var(--typography-font-family-secondary)',
          'font-size': 'var(--typography-font-size-body-body-md)',
          'font-weight': 'var(--typography-font-weight-bold)',
          'line-height': 'var(--typography-line-height-body-md)',
        },
        '.text-md-med': {
          'font-family': 'var(--typography-font-family-secondary)',
          'font-size': 'var(--typography-font-size-body-body-md)',
          'font-weight': 'var(--typography-font-weight-medium)',
          'line-height': 'var(--typography-line-height-body-md)',
        },
        '.text-sm-regular': {
          'font-family': 'var(--typography-font-family-secondary)',
          'font-size': 'var(--typography-font-size-body-body-sm)',
          'font-weight': 'var(--typography-font-weight-regular)',
          'line-height': 'var(--typography-line-height-body-sm)',
        },
        '.text-sm-med': {
          'font-family': 'var(--typography-font-family-secondary)',
          'font-size': 'var(--typography-font-size-body-body-sm)',
          'font-weight': 'var(--typography-font-weight-medium)',
          'line-height': 'var(--typography-line-height-body-sm)',
        },
        '.text-sm-bold': {
          'font-family': 'var(--typography-font-family-secondary)',
          'font-size': 'var(--typography-font-size-body-body-sm)',
          'font-weight': 'var(--typography-font-weight-bold)',
          'line-height': 'var(--typography-line-height-body-sm)',
        },
      });
    },
  ],
};
