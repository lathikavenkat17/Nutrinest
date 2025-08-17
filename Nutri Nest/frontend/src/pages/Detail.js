import React, { useState, useEffect } from "react";
import axios from "axios";
import "./detail.css"; // Assuming you have some styles
const dietOptions = ["none", "keto", "vegan", "vegetarian", "paleo", "regular"];

const Detail = () => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    diet_type: "none", // default
  });

  // ✅ Fetch logged-in user + profile details
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUserAndProfile = async () => {
      try {
        // 1. Get logged-in username
        const userRes = await axios.get("http://127.0.0.1:8000/api/auth/get-user/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const username = userRes.data.username;

        // 2. Get existing profile details
        const profileRes = await axios.get("http://127.0.0.1:8000/api/details/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileRes.data.exists) {
          setForm({
            name: username, // ✅ always from backend
            age: profileRes.data.age || "",
            height: profileRes.data.height || "",
            weight: profileRes.data.weight || "",
            diet_type: profileRes.data.diet_type || "none",
          });
        } else {
          // if no profile yet, still set name
          setForm((prev) => ({ ...prev, name: username }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchUserAndProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.put("http://127.0.0.1:8000/api/details/", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ✅ Username is readonly from backend */}
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        readOnly
      />

      <input
        type="number"
        name="age"
        placeholder="Age"
        value={form.age}
        onChange={handleChange}
      />
      <input
        type="number"
        name="height"
        placeholder="Height (cm)"
        value={form.height}
        onChange={handleChange}
      />
      <input
        type="number"
        name="weight"
        placeholder="Weight (kg)"
        value={form.weight}
        onChange={handleChange}
      />

      <label>Diet Type:</label>
      <select name="diet_type" value={form.diet_type} onChange={handleChange}>
        {dietOptions.map((diet) => (
          <option key={diet} value={diet}>
            {diet.charAt(0).toUpperCase() + diet.slice(1)}
          </option>
        ))}
      </select>

      <button type="submit">Save</button>
    </form>
  );
};

export default Detail;
