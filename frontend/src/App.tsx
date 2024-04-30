// Import necessary components and hooks from react-router-dom and local files
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import EditHotel from "./pages/EditHotel";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";
import MyHotels from "./pages/MyHotels"; 
import Search from "./pages/Search";
import { useAppContext } from "./contexts/useAppContext";

// Define the main App component
const App = () => {
  // Access isLoggedIn state from AppContext using useAppContext hook
  const { isLoggedIn } = useAppContext();

  return (
    // Wrap the entire app with BrowserRouter to enable routing
    <Router>
      {/* Define routes */}
      <Routes>
        {/* Route for home page */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        {/* Route for search page */}
        <Route path="/search" element={<Layout><Search /></Layout>} />
        {/* Route for hotel detail page with dynamic hotelId */}
        <Route path="/detail/:hotelId" element={<Layout><Detail /></Layout>} />
        {/* Route for registration page */}
        <Route path="/register" element={<Layout><Register /></Layout>} />
        {/* Route for sign-in page */}
        <Route path="/sign-in" element={<Layout><SignIn /></Layout>} />
        
        {/* Protected routes accessible only when user is logged in */}
        {isLoggedIn && (
          <>
            {/* Route for booking page of a specific hotel */}
            <Route path="/hotel/:hotelId/booking" element={<Layout><Booking /></Layout>} />
            {/* Route for user's hotels page */}
            <Route path="/my-hotels" element={<Layout><MyHotels /></Layout>} />
            {/* Route for user's bookings page */}
            <Route path="/my-bookings" element={<Layout><MyBookings /></Layout>} />
            {/* Route for editing details of a specific hotel */}
            <Route path="/edit-hotel/:hotelId" element={<Layout><EditHotel /></Layout>} />
          </>
        )}

        {/* Redirect to home page if route doesn't match any defined routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
