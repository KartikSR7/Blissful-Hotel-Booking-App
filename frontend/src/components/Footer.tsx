// Define a functional component named Footer
const Footer = () => {
  return (
    // Outer div with a blue background and padding on the y-axis
    <div className="bg-blue-800 py-10">
      {/* Container with a max-width, centered horizontally */}
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand name with large white text, bold font, and tight letter spacing */}
        <span className="text-3xl text-white font-bold tracking-tight">
          BlissfulEscapes
        </span>
        {/* Navigation links container */}
        <span className="text-white font-bold tracking-tight flex gap-4">
          {/* First navigation link with a pointer cursor */}
          <p className="cursor-pointer">Privacy Policy</p>
          {/* Second navigation link with a pointer cursor */}
          <p className="cursor-pointer">Terms and Service</p>
        </span>
      </div>
    </div>
  );
};

// Export the Footer component
export default Footer;
