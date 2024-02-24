import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router";
import Layout from "./layout/Layout";

const App = () => {
  return (
    <Router>
      <Routes>
    
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        
        
        <Route path="/search" element={<Layout><SearchPage /></Layout>} />

      
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

export default App;
