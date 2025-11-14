import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SearchLawyerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [lawyers, setLawyers] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const query = new URLSearchParams(location.search);
  const specializationName = query.get("specialization") || "";
  const city = query.get("city") || "";

  useEffect(() => {
    fetch("http://localhost:3001/lawyers")
      .then((res) => res.json())
      .then((data) => setLawyers(data))
      .catch((err) => console.log("Error loading:", err));
  }, []);

  useEffect(() => {
    let result = lawyers;
    if (specializationName) {
      result = result.filter(
        (lawyer) =>
          lawyer.specialization &&
          lawyer.specialization.toLowerCase() === specializationName.toLowerCase()
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
  }, [specializationName, city, lawyers]);

  const handleViewProfile = (lawyerId) => {
    navigate(`/lawyer/${lawyerId}`); // điều hướng sang trang profile
  };

  return (
    <>
      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <div className="container py-4" style={{ minHeight: "70vh" }}>
        <h2 className="mb-3">Search Results</h2>
        <p className="text-secondary">
          {specializationName && <span>Specialization: <b>{specializationName}</b></span>}
          {city && <span> | City: <b>{city}</b></span>}
        </p>
        <hr />
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
                    onClick={() => handleViewProfile(lawyer.id)}
                  >
                    View Profile & Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <Footer />
    </>
  );
};

export default SearchLawyerPage;
