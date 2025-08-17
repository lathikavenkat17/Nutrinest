import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./tracker.css";

const Tracker = () => {
  const [category, setCategory] = useState("dish");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consumedFoods, setConsumedFoods] = useState([]);
  const [filter, setFilter] = useState("all_time");

  const token = localStorage.getItem("token");

  // Fetch consumed foods
  const fetchConsumedFoods = async (filterType) => {
    if (!token) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/consumed_foods/?filter=${filterType}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setConsumedFoods(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConsumedFoods(filter);
  }, [filter]);

  // Fetch nutrition data
  useEffect(() => {
    if (!name.trim()) {
      setResult(null);
      setNotFound(false);
      return;
    }
    const fetchNutrition = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await fetch("http://127.0.0.1:8000/api/nutrition/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category, name }),
        });
        const data = await res.json();
        setLoading(false);
        if (res.ok) setResult(data);
        else setNotFound(true);
      } catch {
        setLoading(false);
        setNotFound(true);
      }
    };
    fetchNutrition();
  }, [category, name]);

  // Scale nutrition based on quantity
  const scaledResult = React.useMemo(() => {
    if (!result) return null;
    const factor = quantity / 100;
    return {
      calories: (parseFloat(result.calories || 0) * factor).toFixed(2),
      protein: (parseFloat(result.protein || 0) * factor).toFixed(2),
      fat: (parseFloat(result.fat || 0) * factor).toFixed(2),
      carbs: (parseFloat(result.carbs || 0) * factor).toFixed(2),
    };
  }, [result, quantity]);

  const handleAddConsumed = async () => {
    if (!token || !scaledResult) return alert("Please login and select a food");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/consumed_foods/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category,
          name,
          quantity,
          calories: parseFloat(scaledResult.calories),
          protein: parseFloat(scaledResult.protein),
          fat: parseFloat(scaledResult.fat),
          carbs: parseFloat(scaledResult.carbs),
        }),
      });
      if (res.ok) {
        alert("Added successfully");
        fetchConsumedFoods(filter);
      } else {
        alert("Failed to add");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding consumed food");
    }
  };

  return (
    <div className="tracker-container">
      <h2>Food Nutrition Tracker</h2>

      <div className="input-row">
        <div className="input-group">
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="dish">Dish</option>
            <option value="fruit">Fruit</option>
            <option value="vegetable">Vegetable</option>
            <option value="meat">Meat</option>
          </select>
        </div>

        <div className="input-group">
          <label>Food Name:</label>
          <input
            type="text"
            placeholder="e.g., biryani, banana"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Quantity (grams):</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
      </div>

      {loading && <p>Loading nutrition data...</p>}
      {notFound && <p className="error">❌ Food not found.</p>}

      {scaledResult && (
        <div className="nutrition-preview">
          <h3>Nutrition Facts ({quantity}g)</h3>
          <ul>
            <li>Calories: {scaledResult.calories}</li>
            <li>Protein: {scaledResult.protein}g</li>
            <li>Fat: {scaledResult.fat}g</li>
            <li>Carbs: {scaledResult.carbs}g</li>
          </ul>
          <button onClick={handleAddConsumed}>Add</button>
        </div>
      )}

      <hr />

      <div className="table-header">
        <h3>Consumed Foods</h3>
        <label>
          Show:
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="last_day">Last Day</option>
            <option value="last_week">Last Week</option>
            <option value="last_month">Last Month</option>
            <option value="all_time">All Time</option>
          </select>
        </label>
        <Link to="/Chatbot" className="chatbot-link">
          Go to Chatbot
        </Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Calories</th>
              <th>Protein</th>
              <th>Fat</th>
              <th>Carbs</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {consumedFoods.length === 0 ? (
              <tr>
                <td colSpan="8">No consumed food records found.</td>
              </tr>
            ) : (
              consumedFoods.map((item) => (
                <tr key={item.id}>
                  <td>{item.category}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.calories || "-"}</td>
                  <td>{item.protein || "-"}</td>
                  <td>{item.fat || "-"}</td>
                  <td>{item.carbs || "-"}</td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tracker;
