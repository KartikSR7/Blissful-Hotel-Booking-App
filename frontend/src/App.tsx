import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import { useAppContext } from "./contexts/AppContext";

const App = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/search" element={<Layout><SearchPage /></Layout>} />
        <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
        <Route path="/sign-in" element={<Layout><SignInPage /></Layout>} />
        {isLoggedIn && (
          <>
            <Route path="/add-hotel" element={<Layout><AddHotel/></Layout>} />;
            <Route path="/my-hotels" element={<Layout><MyHotels/></Layout>} />;
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// Home Page component
const HomePage = () => {
  return <p>Home Page</p>;
}

// Search Page component
const SearchPage = () => {
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
