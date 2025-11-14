import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SearchLawyerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [lawyers, setLawyers] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // Lấy query params
  const query = new URLSearchParams(location.search);
  const specialization = query.get("specialization") || "";
  const city = query.get("city") || "";

  // Tải dữ liệu luật sư từ db.json
  useEffect(() => {
    fetch("http://localhost:3001/lawyers")
      .then((res) => res.json())
      .then((data) => setLawyers(data))
      .catch((err) => console.log("Error loading:", err));
  }, []);

  // Lọc lawyers theo specialization + city
  useEffect(() => {
    let result = lawyers;

    if (specialization) {
      result = result.filter(
        (lawyer) =>
          lawyer.specialization &&
          lawyer.specialization.toLowerCase() === specialization.toLowerCase()
      );
    }

    if (city) {
      result = result.filter(
        (lawyer) =>
          lawyer.city &&
          lawyer.city.toLowerCase() === city.toLowerCase()
      );
    }

    setFiltered(result);
  }, [specialization, city, lawyers]);

  return (
    <>
      <Header />

      <div className="container py-4" style={{ minHeight: "70vh" }}>
        <h2 className="mb-3">Search Results</h2>

        {/* Hiển thị điều kiện lọc */}
        <p className="text-secondary">
          {specialization && <span>Category: <b>{specialization}</b> </span>}
          {city && <span> | City: <b>{city}</b></span>}
        </p>

        <hr />

        {/* Nếu không có kết quả */}
        {filtered.length === 0 ? (
          <p className="text-danger">No lawyers found.</p>
        ) : (
          <div className="row">
            {filtered.map((lawyer) => (
              <div className="col-md-4 mb-4" key={lawyer.id}>
                <div className="card shadow-sm p-3">
                  <img
                    src={lawyer.image}
                    alt={lawyer.name}
                    className="card-img-top rounded"
                  />
                  <h5 className="mt-3">{lawyer.name}</h5>
                  <p className="mb-1">{lawyer.specialization}</p>
                  <p className="text-muted">{lawyer.city}</p>
                  <p>⭐ {lawyer.rating}</p>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => navigate(`/lawyer/${lawyer.id}`)}
                  >
                    View Profile & Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default SearchLawyerPage;
