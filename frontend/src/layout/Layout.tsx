// Importing necessary components
import Footer from "../components/Footer"; // Importing the Footer component
import Header from "../components/Header"; // Importing the Header component
import Hero from "../components/Hero"; // Importing the Hero component
import SearchBar from "../components/SearchBar"; // Importing the SearchBar component

// Defining the Props interface
interface Props {
  children: React.ReactNode; // Define a prop 'children' of type React.ReactNode
}

// Defining the Layout component
const Layout = ({ children }: Props) => {
  return (
    // Outer div with flex column layout and minimum height of the screen
    <div className="flex flex-col min-h-screen">
      {/* Render the Header component */}
      <Header />
      {/* Render the Hero component */}
      <Hero />
      {/* Container for content with centered content */}
      <div className="container mx-auto">
        {/* Render the SearchBar component */}
        <SearchBar />
      </div>
      {/* Container for main content with padding, flexible to fill remaining space */}
      <div className="Container mx-auto py-10 flex-1">
        {/* Render the children components passed as props */}
        {children}
      </div>
      {/* Render the Footer component */}
      <Footer />
    </div>
  );
};

// Export the Layout component as default
export default Layout;
