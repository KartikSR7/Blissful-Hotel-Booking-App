// Importing the Link component from react-router-dom to create navigation links
import { Link } from "react-router-dom";
// Importing the useAppContext hook from the AppContext module to access application context
import { useAppContext } from "../contexts/AppContext";

// Header component definition
const Header = () => {
    // Destructuring isLoggedIn property from the context returned by useAppContext hook
    const { isLoggedIn } = useAppContext();
    
    // Returning JSX for the header component
    return (
        <div className="bg-blue-800 py-6"> {/* Outer container with blue background */}
            <div className="container mx-auto flex justify-between"> {/* Inner container with flex layout */}
                {/* Site title */}
                <span className="text-3xl text-white font-bold tracking-tight">
                    {/* Link to the homepage */}
                    <Link to="/">BlissfulEscapes.com</Link>
                </span>
                <span className="flex space-x-2"> {/* Container for links/buttons */}
                    {/* Conditional rendering based on user authentication status */}
                    {isLoggedIn ? ( /* If user is logged in */
                        <> {/* Fragment shorthand */}
                            {/* Link to the "My Bookings" page */}
                            <Link to="/my-bookings">My Bookings</Link>
                            {/* Link to the "My Hotels" page */}
                            <Link to="/my-hotels">My Hotels</Link>
                            {/* Button for signing out */}
                            <button>Sign Out</button>
                        </> /* End of fragment */
                    ) : ( /* If user is not logged in */
                        <Link to="/sign-in" className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100 hover:text-green-500">
                            Sign In
                        </Link>
                    )}
                </span>
            </div>
        </div>
    );
};

// Exporting the Header component as default
export default Header;
