import React, { useState, useRef, useEffect } from "react";
import "./chatbot.css"; // make sure to create Chatbot.css with the CSS I gave earlier

const foodData = {
  meat_egg: ["Chicken Breast", "Eggs", "Turkey", "Salmon"],
  vegetable: ["Spinach", "Broccoli", "Carrots", "Bell Peppers"],
  fruit: ["Apple", "Banana", "Orange", "Mango"],
  indian_food: ["Paneer Curry", "Chana Masala", "Dal Tadka", "Roti"]
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState("");
  const [consumed, setConsumed] = useState({
    meat_egg: [],
    vegetable: [],
    fruit: [],
    indian_food: []
  });

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input) return;

    const userMessage = { from: "user", text: input };
    setMessages(prev => [...prev, userMessage]);

    const msg = input.toLowerCase().trim();

    if (step === 0) {
      setMessages(prev => [...prev, { from: "bot", text: "Do you want food suggestions? (yes/no)" }]);
      setStep(1);
    } else if (step === 1) {
      if (msg.includes("yes")) {
        setMessages(prev => [...prev, { from: "bot", text: "Which type of food? (meat_egg, vegetable, indian_food, fruit)" }]);
        setStep(2);
      } else {
        setMessages(prev => [...prev, { from: "bot", text: "Okay, no suggestions for now 😊" }]);
        setStep(0);
      }
    } else if (step === 2) {
      if (foodData[msg]) {
        setCategory(msg);

        // Filter out already consumed foods
        const availableItems = foodData[msg].filter(item => !consumed[msg].includes(item));

        if (availableItems.length === 0) {
          setMessages(prev => [...prev, { from: "bot", text: "You've tried all foods in this category! Choose another category." }]);
          setStep(2); // stay in category selection
          setInput("");
          return;
        }

        const suggestion = availableItems[Math.floor(Math.random() * availableItems.length)];

        // Mark food as consumed
        setConsumed(prev => ({
          ...prev,
          [msg]: [...prev[msg], suggestion]
        }));

        setMessages(prev => [
          ...prev,
          { from: "bot", text: `How about **${suggestion}**? ✅` },
          { from: "bot", text: "Do you want another suggestion? (yes/no)" }
        ]);
        setStep(3);
      } else {
        setMessages(prev => [...prev, { from: "bot", text: "Please choose from: meat_egg, vegetable, indian_food, fruit" }]);
      }
    } else if (step === 3) {
      if (msg.includes("yes") && category) {
        const availableItems = foodData[category].filter(item => !consumed[category].includes(item));

        if (availableItems.length === 0) {
          setMessages(prev => [...prev, { from: "bot", text: "You've tried all foods in this category! Choose another category." }]);
          setStep(2);
          setInput("");
          return;
        }

        const suggestion = availableItems[Math.floor(Math.random() * availableItems.length)];

        setConsumed(prev => ({
          ...prev,
          [category]: [...prev[category], suggestion]
        }));

        setMessages(prev => [
          ...prev,
          { from: "bot", text: `Try **${suggestion}** this time 🍽️` },
          { from: "bot", text: "Want more suggestions? (yes/no)" }
        ]);
      } else {
        setMessages(prev => [...prev, { from: "bot", text: "Alright! Come back anytime for food suggestions." }]);
        setStep(0);
        setCategory("");
      }
    }

    setInput("");
  };

  return (
    <div className="chatbot-container">
      <h2 className="chatbot-header">Diet Chatbot 🍏</h2>
      <div className="chatbot-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${msg.from === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
