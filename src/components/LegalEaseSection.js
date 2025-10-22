import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // 👈 thêm dòng này
import specializations from "../data/specializations.json";
import cities from "../data/cities.json";

const LegalEaseSection = () => {
  const [activeTab, setActiveTab] = useState("issue");
  const [visibleIssues, setVisibleIssues] = useState(15);
  const [visibleCities, setVisibleCities] = useState(15);
  const navigate = useNavigate(); // 👈 để điều hướng khi click

  // Chia mảng thành từng nhóm
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

  // 👇 Khi click vào category
  const handleCategoryClick = (categoryName) => {
    const query = new URLSearchParams({ category: categoryName }).toString();
    navigate(`/search?${query}`);
  };

  // 👇 Khi click vào city
  const handleCityClick = (cityName) => {
    const query = new URLSearchParams({ city: cityName }).toString();
    navigate(`/search?${query}`);
  };

  return (
    <div className="container text-center py-5" style={{ maxWidth: "1100px" }}>
      {/* --- Tiêu đề --- */}
      <h2 className="fw-semibold mb-5 fs-2 text-dark">
        LegalEase Helps You Find the Right Lawyer!
      </h2>

      {/* --- Giới thiệu --- */}
      <div className="row justify-content-center text-start mb-5">
        <div className="col-md-7">
          <h3 className="fw-semibold fs-4 mb-3">
            Present Your Case to Local Lawyers in Minutes
          </h3>
          <p>
            Our legal service matches you with highly rated, licensed lawyers near you — for free.
            Over seven million people and businesses have posted cases on LegalEase.{" "}
            <a href="#" className="text-primary text-decoration-underline">
              Present your case now!
            </a>
          </p>
        </div>
        <div className="col-md-5">
          <h3 className="fw-semibold fs-4 mb-3">Are You a Lawyer?</h3>
          <p>
            Generate consistent clients with our{" "}
            <a href="#" className="text-primary text-decoration-underline">
              legal marketing service.
            </a>
          </p>
        </div>
      </div>

      {/* --- Mở rộng sang Việt Nam --- */}
      <div className="mb-5">
        <h3 className="fw-semibold fs-3 mb-3">
          LegalEase Expands Services to Vietnam Clients and Lawyers
        </h3>
        <p>
          For clients from Vietnam, you can now{" "}
          <a href="#" className="text-primary text-decoration-underline">
            post your cases
          </a>{" "}
          at LegalEase and get matched to lawyers in your area.
        </p>
      </div>

      {/* --- Tabs --- */}
      <ul className="nav nav-tabs justify-content-center mb-4" role="tablist">
        <li className="fs-3 nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "issue" ? "active fw-semibold" : ""}`}
            onClick={() => setActiveTab("issue")}
          >
            Find a Lawyer by Issue
          </button>
        </li>
        <li className="fs-3 nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "city" ? "active fw-semibold" : ""}`}
            onClick={() => setActiveTab("city")}
          >
            Find a Lawyer by City
          </button>
        </li>
      </ul>

      {/* --- Tab content --- */}
      <div className="tab-content text-start mx-auto" style={{ maxWidth: "900px" }}>
        {/* Tab 1: By Issue */}
        {activeTab === "issue" && (
          <div className="tab-pane fade show active">
            <div className="row justify-content-center">
              {issueColumns.map((col, i) => (
                <div className="col-12 col-sm-6 col-md-4" key={i}>
                  <ul className="list-unstyled">
                    {col.map((item, index) => (
                      <li key={index} className="mb-2">
                        <button
                          onClick={() => handleCategoryClick(item.name)}
                          className="btn btn-link text-primary text-decoration-none fs-5 p-0"
                          style={{ cursor: "pointer" }}
                        >
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Nút Show More / Less */}
            <div className="mt-3 text-center">
              {visibleIssues < specializations.length ? (
                <button
                  className="btn btn-link text-primary d-inline-flex align-items-center justify-content-center"
                  onClick={() => setVisibleIssues((prev) => prev + 15)}
                >
                  <FaChevronDown className="me-2" />
                  Show More Categories
                </button>
              ) : (
                <button
                  className="btn btn-link text-primary d-inline-flex align-items-center justify-content-center"
                  onClick={() => setVisibleIssues(15)}
                >
                  <FaChevronUp className="me-2" />
                  Show Less Categories
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: By City */}
        {activeTab === "city" && (
          <div className="tab-pane fade show active">
            <div className="row justify-content-center">
              {cityColumns.map((col, i) => (
                <div className="col-12 col-sm-6 col-md-4" key={i}>
                  <ul className="list-unstyled">
                    {col.map((city, index) => (
                      <li key={index} className="mb-2">
                        <button
                          onClick={() => handleCityClick(city.name)}
                          className="btn btn-link text-primary text-decoration-none fs-5 p-0"
                          style={{ cursor: "pointer" }}
                        >
                          {city.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Nút Show More / Less */}
            <div className="mt-3 text-center">
              {visibleCities < cities.length ? (
                <button
                  className="btn btn-link text-primary d-inline-flex align-items-center justify-content-center"
                  onClick={() => setVisibleCities((prev) => prev + 15)}
                >
                  <FaChevronDown className="me-2" />
                  Show More Cities
                </button>
              ) : (
                <button
                  className="btn btn-link text-primary d-inline-flex align-items-center justify-content-center"
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
