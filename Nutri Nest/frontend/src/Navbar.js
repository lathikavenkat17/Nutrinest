// Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("expiry");
  navigate("/login"); // better than window.location.href
};


  if (!token) return null; // Hide navbar if not logged in

  return (
    <nav className="navbar">
      <div className="logo">NutriNest</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/create">Create Recipe</Link></li>
        <li><Link to="/track">Track</Link></li>
        <li><Link to="/details">Details</Link></li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </nav>
  );
};

export default Navbar;
