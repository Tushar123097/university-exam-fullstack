import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import pages
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import ViewDocuments from "./pages/ViewDocuments";
import Profile from "./components/Profile";
import ManageDocuments from "./pages/ManageDocuments";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/upload" element={<Upload />} />
          <Route path="/view" element={<ViewDocuments />} />
          <Route path="/profile" element={<Profile />} /> 
            <Route path="/my-documents" element={<ManageDocuments />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}


        {/* If no route matches */}
        <Route path="*" element={<h1 className="text-center text-white mt-10">404 Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
