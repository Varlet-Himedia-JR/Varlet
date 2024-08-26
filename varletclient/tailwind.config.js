/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}',"./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        customYellow: '#ffed8c',
        customblue:'#1e90ff',
      },
      zindex:{
        '105':'105',
        '200':'200'
      }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ]
}
