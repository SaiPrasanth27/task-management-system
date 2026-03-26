export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        'primary-hover': '#4338ca',
        secondary: '#64748b',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        darkbg: '#0f172a',
        darkcard: '#1e293b',
        darkborder: '#334155',
      }
    },
  },
  darkMode: 'class', // We will use a Tailwind approach
  plugins: [],
}
