import React, { useEffect, useState } from "react";
import axios from "axios";

function DetailsEdit() {
  const [formData, setFormData] = useState({ name: "", age: "", height: "", weight: "" });

  useEffect(() => {
    axios.get("/api/details/").then((res) => {
      setFormData({
        name: res.data.name || "",
        age: res.data.age || "",
        height: res.data.height || "",
        weight: res.data.weight || "",
      });
    });
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put("/api/details/", formData);
    alert("Profile updated!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Your Details</h2>
      <input name="name" value={formData.name} onChange={handleChange} />
      <input name="age" type="number" value={formData.age} onChange={handleChange} />
      <input name="height" type="number" value={formData.height} onChange={handleChange} />
      <input name="weight" type="number" value={formData.weight} onChange={handleChange} />
      <button type="submit">Update</button>
    </form>
  );
}

export default DetailsEdit;
