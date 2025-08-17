import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./register.css"; // Import the CSS

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/auth/register/", form);

      const loginRes = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
        username: form.username,
        password: form.password,
      });

      localStorage.setItem("token", loginRes.data.access);
      navigate("/details");
    } catch (err) {
      console.error("Registration error", err);
    }
  };

  return (
    <div className="register-page">
      <div className="right">
      <div className="register-form-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" onChange={handleChange} required />
          <input name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default Register;
