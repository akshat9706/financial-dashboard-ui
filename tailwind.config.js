/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#0d0f14',
        surface:  '#13161e',
        surface2: '#1a1e2a',
        muted:    '#636880',
        accent:   '#c8f04d',
        accent2:  '#4d9ff0',
        danger:   '#f0604d',
        success:  '#4df0a0',
        warn:     '#f0c44d',
        ink:      '#e8eaf0',
      },
      fontFamily: {
        head: ['"DM Serif Display"', 'serif'],
        body: ['Syne', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      borderRadius: {
        card:  '20px',
        field: '12px',
      },
      animation: {
        'fade-up':  'fadeUp 0.4s ease both',
        'fade-in':  'fadeIn 0.3s ease both',
        'slide-in': 'slideIn 0.3s ease both',
      },
      keyframes: {
        fadeUp:  { from:{ opacity:'0', transform:'translateY(16px)' }, to:{ opacity:'1', transform:'translateY(0)' } },
        fadeIn:  { from:{ opacity:'0' },                               to:{ opacity:'1' } },
        slideIn: { from:{ opacity:'0', transform:'translateX(20px)' }, to:{ opacity:'1', transform:'translateX(0)' } },
      },
      boxShadow: {
        card:   '0 12px 40px rgba(0,0,0,0.3)',
        accent: '0 8px 24px rgba(200,240,77,0.25)',
        modal:  '0 24px 80px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};
