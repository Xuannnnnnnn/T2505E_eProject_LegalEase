import React from "react";
import { Link } from "react-router-dom";
import lawyers from "../data/lawyers.json";
import Header from "../components/Header";
import Footer from "../components/Footer";

function SearchLawyerPage() {
  return (
    <>
    <Header/>
      <div className="container my-5">
        <h3 className="text-center mb-4 text-primary fw-bold">
          🔍 Featured Lawyers
        </h3>

        <div className="row g-4">
          {lawyers.map((lawyer) => (
            <div className="col-md-4" key={lawyer.lawyer_id}>
              <div className="card shadow-sm border-0 rounded-4">
                <img
                  src={`/${lawyer.image}`}
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
                  <Link
                    to={`/lawyer/${lawyer.lawyer_id}`}
                    className="btn btn-outline-primary w-100"
                  >
                    View Full Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default SearchLawyerPage;
