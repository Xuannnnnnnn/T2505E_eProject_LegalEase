import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // 👈 để đọc query từ URL
import categoriesData from "../data/categories.json";
import lawyersData from "../data/lawyers.json"; // 👈 file giả lập danh sách luật sư
import "../App.css";

const SearchLawyerPage = () => {
  const [categories, setCategories] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("");

  const locationHook = useLocation(); // 👈 Lấy query string (ví dụ: ?category=Civil%20Law&city=HaNoi)

  // Hàm đọc query từ URL
  const getQueryParams = () => {
    const params = new URLSearchParams(locationHook.search);
    return {
      category: params.get("category") || "",
      city: params.get("city") || "",
      keyword: params.get("keyword") || "",
      location: params.get("location") || "",
    };
  };

  // Khi trang load hoặc URL thay đổi
  useEffect(() => {
    setCategories(categoriesData);
    setLawyers(lawyersData);

    const { category, city, keyword, location } = getQueryParams();

    setSelectedCategory(category);
    setLocation(city || location);

    // Tự động lọc theo query
    let filtered = lawyersData;

    if (category) {
      filtered = filtered.filter((lawyer) =>
        lawyer.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (city || location) {
      const loc = city || location;
      filtered = filtered.filter((lawyer) =>
        lawyer.location.toLowerCase().includes(loc.toLowerCase())
      );
    }

    if (keyword) {
      filtered = filtered.filter(
        (lawyer) =>
          lawyer.name.toLowerCase().includes(keyword.toLowerCase()) ||
          lawyer.category.toLowerCase().includes(keyword.toLowerCase()) ||
          lawyer.description.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    setSearchResults(filtered);
  }, [locationHook.search]);

  // Khi người dùng bấm nút Search
  const handleSearch = (e) => {
    e.preventDefault();
    let results = lawyers;

    if (selectedCategory) {
      results = results.filter((lawyer) =>
        lawyer.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (location) {
      results = results.filter((lawyer) =>
        lawyer.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    setSearchResults(results);
  };

  return (
    <div className="search-lawyer-page">
      {/* HERO SEARCH SECTION */}
      <section
        className="hero-banner"
        style={{
          background: 'url("images/lawyer-hero.png") no-repeat center right/cover',
          color: "#000",
          minHeight: "65vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="container text-center">
          <h1 className="hero-title">Find the Right Lawyer for Your Legal Issue!</h1>
          <p className="hero-subtitle">Fast, Free and Confidential</p>

          <form className="hero-form" onSubmit={handleSearch}>
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

      {/* RESULTS SECTION */}
      <section className="results-section container py-5">
        <h2 className="results-title mb-4">Top Lawyers</h2>
        <div className="lawyer-list">
          {searchResults.length > 0 ? (
            searchResults.map((lawyer) => (
              <div key={lawyer.id} className="lawyer-card shadow-sm p-3 mb-4 rounded d-flex">
                <img
                  src={lawyer.image}
                  alt={lawyer.name}
                  className="lawyer-photo me-3"
                  style={{ width: "140px", height: "140px", objectFit: "cover", borderRadius: "10px" }}
                />
                <div className="lawyer-info">
                  <h3 className="mb-1">{lawyer.name}</h3>
                  <p className="text-primary fw-semibold">{lawyer.category}</p>
                  <p className="text-muted small">{lawyer.description}</p>
                  <p className="mb-2">
                    <strong>Location:</strong> {lawyer.location}
                  </p>
                  <button className="btn btn-outline-primary btn-sm">View Full Profile</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted fs-5">No lawyers found matching your search.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchLawyerPage;
