import React, { useEffect, useState } from "react";
import axios from "axios";
import "./home.css";

const DEFAULT_GOALS = { calories: 2000, protein: 50, carbs: 300, fat: 70 };
const DIET_GOALS = {
  none: DEFAULT_GOALS,
  keto: { calories: 1800, protein: 70, carbs: 50, fat: 120 },
  vegan: { calories: 2000, protein: 60, carbs: 320, fat: 60 },
  vegetarian: { calories: 2000, protein: 55, carbs: 300, fat: 65 },
  paleo: { calories: 2200, protein: 80, carbs: 150, fat: 90 },
  regular: DEFAULT_GOALS,
};

function Home() {
  const [dietType, setDietType] = useState("none");
  const [goal, setGoal] = useState(DIET_GOALS["none"]);
  const [nutritionProgress, setNutritionProgress] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/details/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const userDiet = res.data.diet_type || "none";
        setDietType(userDiet);
        setGoal(DIET_GOALS[userDiet] || DEFAULT_GOALS);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchConsumedFood = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/consumed_foods/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const foods = res.data;

        const totals = foods.reduce(
          (acc, food) => {
            acc.calories += parseFloat(food.nutrition.calories) || 0;
            acc.protein += parseFloat(food.nutrition.protein) || 0;
            acc.carbs += parseFloat(food.nutrition.carbs) || 0;
            acc.fat += parseFloat(food.nutrition.fat) || 0;
            return acc;
          },
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );


        setNutritionProgress(totals);
      } catch (err) {
        console.error("Error fetching consumed foods:", err);
      }
    };
    fetchConsumedFood();
  }, []);

  const getPercentage = (nutrient) =>
    Math.min(Math.round((nutritionProgress[nutrient] / goal[nutrient]) * 100), 100);

  return (
    <div className="home-container">
      {/* Full Background with Curved Text Box */}
      <div className="home-banner">
        <div className="text-box">
          <h1>Welcome To NutriNest</h1>
          <p>Your smart companion for healthy eating, tailored meal plans, and a balanced life.</p>
        </div>
      </div>

      {/* Circular Progress Section */}
      <div className="circular-progress-section">
        <h3>Daily Nutrition Progress ({dietType} diet)</h3>
        <div className="circular-progress-row">
          {["calories", "protein", "carbs", "fat"].map((nutrient) => (
            <div className="circular-progress-wrapper" key={nutrient}>
              <svg className="circular-progress" viewBox="0 0 36 36">
                <path
                  className="circle-bg"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`circle ${nutrient}`}
                  strokeDasharray={`${getPercentage(nutrient)}, 100`}
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="percentage">
                  {getPercentage(nutrient)}%
                </text>
              </svg>
              <div className="nutrient-label">{nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
