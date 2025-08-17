// App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Tracker from "./pages/Tracker";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Detail from "./pages/Detail"; // this will handle create/edit details
import Chatbot from "./pages/chatbot"; // Importing the chatbot component

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token || token === "null" || token === "undefined") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};


function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-green-50">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/create" element={<RequireAuth><Create /></RequireAuth>} />
          <Route path="/track" element={<RequireAuth><Tracker /></RequireAuth>} />
          <Route path="/details" element={<RequireAuth><Detail /></RequireAuth>} />
          <Route path="/chatbot" element={<RequireAuth><Chatbot /></RequireAuth>} />
          
          {/* Redirect any unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
