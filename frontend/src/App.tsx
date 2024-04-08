import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
//import { useAppContext } from "./contexts/AppContext";
import EditHotel from "./pages/EditHotel";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";
import { useAppContext } from "./contexts/useAppContext";
// import Search from "./pages/Search";

const App = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home/></Layout>} />
        <Route path="/search" element={<Layout><Search/></Layout>} />
        <Route path="/detail/:hotelId" element={<Layout><Detail/></Layout>} />
        <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
        <Route path="/sign-in" element={<Layout><SignInPage /></Layout>} />
        {isLoggedIn && (
          <>
            <Route path="//hotel/:hotelId/booking" element={<Layout><Booking/></Layout>} />;
            <Route path="/my-hotels" element={<Layout><MyHotels/></Layout>} />;
            <Route path="/my-bookings" element={<Layout><MyBookings/></Layout>} />;
            <Route path="/edit-hotel/:hotelId" element={<Layout><EditHotel/></Layout>} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// // Home Page component
// const Home= () => {
//   return <p>Home Page</p>;
// }

// Search Page component
const Search = () => {
  return <p>Search Page</p>;
}

// Register Page component
const RegisterPage = () => {
  return <Register/>;
}

// Sign In Page component
const SignInPage = () => {
  return <SignIn/>;
}

// My Hotels Page component
const MyHotels = () => {
  return <AddHotel/>;
}

export default App;
