export default {
  // Content files to process for Tailwind CSS
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  // Customizing Tailwind CSS theme
  theme: {
    // Extending Tailwind CSS default theme (currently empty)
    extend: {},

    // Customizing container element styles
    container: {
      // Adding padding to container element at medium breakpoint
      padding: {
        md: "10rem", 
      },
    },
  },

  // Additional plugins for Tailwind CSS (none specified)
  plugins: [],
}
