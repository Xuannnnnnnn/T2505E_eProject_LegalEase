import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import categoriesData from "../data/categories.json";
import "../App.css";

const HeroSection = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setCategories(categoriesData);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Nếu không nhập gì thì bỏ qua
    if (!selectedCategory && !location) return;

    // Điều hướng kèm query params
    navigate(
      `/search?category=${encodeURIComponent(selectedCategory)}&city=${encodeURIComponent(location)}`
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
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
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
