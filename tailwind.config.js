/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink:      '#1D2420',
        mist:     '#F7F6F3',
        leaf:     '#6E9273',
        coral:    '#C75A53',
        amber:    '#CDA04F',
        slate2:   '#627687',
        border:   '#DFE4DD',
        forest:   '#20342C',
        sage:     '#B2CBB6',
        surface:  '#ECEFEA',
        charcoal: '#1D2420',
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px', letterSpacing: '0.08em' }],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
        lift: '0 4px 14px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
};