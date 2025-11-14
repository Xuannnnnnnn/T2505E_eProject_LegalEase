import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import specializations from "../data/specializations.json";
import "../App.css";

const HeroSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCategory && !location) return;

    navigate(
      `/search?specialization=${encodeURIComponent(selectedCategory)}&city=${encodeURIComponent(location)}`
    );
  };

  return (
    <section
      className="hero-banner"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "65vh",
        color: "#000",
        background: 'url("images/lawyer-hero.png") no-repeat center right/cover',
        display: "flex",
        alignItems: "center",
        padding: "60px 0",
        marginTop: "-10px",
      }}
    >
      <div className="container">
        <h1 className="hero-title">
          Find the Right Lawyer
          <br /> for Your Legal Issue!
        </h1>
        <p className="hero-subtitle">Fast, Free and Confidential</p>

        <form className="hero-form" onSubmit={handleSubmit}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Choose a Category</option>
            {specializations.map((item) => (
              <option key={item.specialization_id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="ZIP Code or Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button type="submit" className="hero-btn">
            Search for Attorneys →
          </button>
        </form>

        <p className="hero-footer">
          Can't find a category? <a href="#">Click here</a>
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
