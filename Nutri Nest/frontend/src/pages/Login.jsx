import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleLogin = async (username, password) => {
  try {
    const res = await axios.post("http://127.0.0.1:8000/api/login/", {
      username,
      password
    });

    const { access, refresh, username: userName, email } = res.data;

    localStorage.setItem("token", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("username", userName); // ✅ save username
    localStorage.setItem("email", email);       // ✅ save email

    console.log("Logged in as:", userName, email);
  } catch (err) {
    console.error("Login failed", err);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/login/", form);
      const { access, refresh } = res.data;
      const expiry = new Date().getTime() + 15 * 60 * 1000;

      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("expiry", expiry);

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      <div className="left">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" onClick={handleLogin}>Login</button>
        </form>

        <p className="new-user-text">
          New user? <Link to="/Register">Create an account</Link>
        </p>
      </div>
      </div>
    </div>
  );
};

export default Login;
