import React, { useState } from "react";
import "./create.css"; // Import CSS

const Create = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const vegetables = ["Carrot", "Broccoli", "Spinach", "Tomato", "Potato", "Onion"];
  const meats = ["Chicken", "Beef", "Pork", "Fish"];
  const fruits = ["Apple", "Banana", "Mango", "Strawberry"];

  const handleAddIngredient = (item) => {
    const currentList = ingredients
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i);

    if (!currentList.includes(item)) {
      setIngredients(currentList.concat(item).join(", "));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRecipe("");
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/generate-recipe/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.recipe) {
        setRecipe(data.recipe);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-container">
      <h2>Create a Recipe with AI</h2>
      <form onSubmit={handleSubmit} className="create-form">
        <label>Ingredients:</label>
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Type ingredient or click below..."
          className="search-bar"
        />
        <button type="submit" disabled={loading} className="generate-btn">
          {loading ? "Generating..." : "Generate Recipe"}
        </button>
      </form>

      <div className="ingredient-section">
  <h3>Vegetables</h3>
  <div className="ingredient-list">
    {vegetables.map((veg) => (
      <div key={veg} className="ingredient-box" onClick={() => handleAddIngredient(veg)}>
        {veg} <span className="plus-btn">+</span>
      </div>
    ))}
  </div>

  <h3>Meats</h3>
  <div className="ingredient-list">
    {meats.map((meat) => (
      <div key={meat} className="ingredient-box" onClick={() => handleAddIngredient(meat)}>
        {meat} <span className="plus-btn">+</span>
      </div>
    ))}
  </div>

  <h3>Fruits</h3>
  <div className="ingredient-list">
    {fruits.map((fruit) => (
      <div key={fruit} className="ingredient-box" onClick={() => handleAddIngredient(fruit)}>
        {fruit} <span className="plus-btn">+</span>
      </div>
    ))}
  </div>
</div>



      {error && <p className="error-msg">Error: {error}</p>}

      {recipe && (
        <div className="recipe-output">
          <h3>Your Recipe:</h3>
          <p>{recipe}</p>
        </div>
      )}
    </div>
  );
};

export default Create;
