import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import specializations from "../data/specializations.json";

const LegalEaseSection = () => {
  const [activeTab, setActiveTab] = useState("issue");
  const [visibleIssues, setVisibleIssues] = useState(15);
  const [visibleCities, setVisibleCities] = useState(15);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/cities")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => console.log("Error loading cities:", err));
  }, []);

  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const visibleIssueItems = specializations.slice(0, visibleIssues);
  const visibleCityItems = cities.slice(0, visibleCities);

  const issueColumns = chunkArray(visibleIssueItems, 5);
  const cityColumns = chunkArray(visibleCityItems, 5);

  const handleCategoryClick = (specializationName) => {
    navigate(`/search?specialization=${encodeURIComponent(specializationName)}`);
  };

  const handleCityClick = (cityName) => {
    navigate(`/search?city=${encodeURIComponent(cityName)}`);
  };

  return (
    <div className="container text-center py-5" style={{ maxWidth: "1100px" }}>
      <h2 className="fw-semibold mb-5 fs-2 text-dark">
        LegalEase Helps You Find the Right Lawyer!
      </h2>

      <ul className="nav nav-tabs justify-content-center mb-4" role="tablist">
        <li className="fs-3 nav-item">
          <button
            className={`nav-link ${activeTab === "issue" ? "active fw-semibold" : ""}`}
            onClick={() => setActiveTab("issue")}
          >
            Find a Lawyer by Issue
          </button>
        </li>
        <li className="fs-3 nav-item">
          <button
            className={`nav-link ${activeTab === "city" ? "active fw-semibold" : ""}`}
            onClick={() => setActiveTab("city")}
          >
            Find a Lawyer by City
          </button>
        </li>
      </ul>

      <div className="tab-content text-start mx-auto" style={{ maxWidth: "900px" }}>
        {activeTab === "issue" && (
          <div>
            <div className="row justify-content-center">
              {issueColumns.map((col, i) => (
                <div className="col-12 col-sm-6 col-md-4" key={i}>
                  <ul className="list-unstyled">
                    {col.map((item, index) => (
                      <li key={index} className="mb-2">
                        <button
                          onClick={() => handleCategoryClick(item.name)}
                          className="btn btn-link text-primary text-decoration-none fs-5 p-0"
                        >
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center">
              {visibleIssues < specializations.length ? (
                <button
                  className="btn btn-link text-primary d-inline-flex align-items-center"
                  onClick={() => setVisibleIssues((prev) => prev + 15)}
                >
                  <FaChevronDown className="me-2" />
                  Show More Categories
                </button>
              ) : (
                <button
                  className="btn btn-link text-primary d-inline-flex align-items-center"
                  onClick={() => setVisibleIssues(15)}
                >
                  <FaChevronUp className="me-2" />
                  Show Less Categories
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === "city" && (
          <div>
            <div className="row justify-content-center">
              {cityColumns.map((col, i) => (
                <div className="col-12 col-sm-6 col-md-4" key={i}>
                  <ul className="list-unstyled">
                    {col.map((city, index) => (
                      <li key={index} className="mb-2">
                        <button
                          onClick={() => handleCityClick(city.name)}
                          className="btn btn-link text-primary text-decoration-none fs-5 p-0"
                        >
                          {city.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center">
              {visibleCities < cities.length ? (
                <button
                  className="btn btn-link text-primary d-inline-flex align-items-center"
                  onClick={() => setVisibleCities((prev) => prev + 15)}
                >
                  <FaChevronDown className="me-2" />
                  Show More Cities
                </button>
              ) : (
                <button
                  className="btn btn-link text-primary d-inline-flex align-items-center"
                  onClick={() => setVisibleCities(15)}
                >
                  <FaChevronUp className="me-2" />
                  Show Less Cities
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalEaseSection;
