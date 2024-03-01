import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Register from "./pages/Register";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/search" element={<Layout><SearchPage /></Layout>} />
        <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
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
  return <Register />;
}

export default App;
