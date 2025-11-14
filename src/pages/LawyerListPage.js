// src/pages/LawyerListPage.js
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const BASE_URL = "http://localhost:3001";

function LawyerListPage() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const specialization = queryParams.get("specialization") || "";
  const keyword = queryParams.get("keyword") || "";

  useEffect(() => {
    const fetchLawyers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/lawyers`);
        let data = await res.json();
        data = data.filter((l) => l.status === "Approved"); // chỉ lấy approved
        // Lọc theo specialization
        if (specialization) {
          data = data.filter((l) =>
            l.specialization?.toLowerCase() === specialization.toLowerCase()
          );
        }
        // Lọc theo keyword (tên hoặc city)
        if (keyword) {
          data = data.filter(
            (l) =>
              l.name.toLowerCase().includes(keyword.toLowerCase()) ||
              l.city.toLowerCase().includes(keyword.toLowerCase())
          );
        }
        setLawyers(data);
      } catch (err) {
        console.error("Error fetching lawyers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, [specialization, keyword]);

  return (
    <>
      <Header />
      <div className="container my-5">
        <h3 className="text-center mb-4 text-primary fw-bold">
          {specialization
            ? `Lawyers in ${specialization}`
            : keyword
              ? `Search Results for "${keyword}"`
              : "All Lawyers"}
        </h3>

        {loading ? (
          <p className="text-center">Loading lawyers...</p>
        ) : lawyers.length === 0 ? (
          <p className="text-center text-muted">No lawyers found.</p>
        ) : (
          <div className="row g-4">
            {lawyers.map((lawyer) => (
              <div className="col-md-4" key={lawyer.id}>
                <div className="card shadow-sm border-0 rounded-4">
                  <img
                    src={lawyer.image}
                    alt={lawyer.name}
                    className="card-img-top"
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-primary fw-bold">{lawyer.name}</h5>
                    <p className="card-text text-muted mb-1">{lawyer.city}</p>
                    <p className="text-success fw-semibold">
                      ${lawyer.hourly_rate}/hour
                    </p>
                    <p className="small text-secondary">
                      ⭐ {lawyer.rating?.toFixed(1) || 0} / 5 | {lawyer.experience_years || 0} năm KN
                    </p>
                    <Link
                      to={`/lawyer/${lawyer.id}`}
                      className="btn btn-outline-primary w-100"
                    >
                      View Full Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default LawyerListPage;
