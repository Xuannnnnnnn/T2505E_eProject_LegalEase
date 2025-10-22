// src/components/FeaturedLawyers.js
import React from "react";
import lawyers from "../data/lawyers.json";

function FeaturedLawyers() {
  // Lấy 3 luật sư đầu tiên để hiển thị nổi bật
  const featuredLawyers = lawyers.slice(0, 3);

  return (
    <section className="py-5" style={{ backgroundColor: "#fafcf9" }}>
      <div className="container text-center">
        <h2 className="mb-5 fw-bold text-primary">Featured Lawyers</h2>

        {/* ✅ Hiển thị 3 luật sư trên cùng 1 dòng */}
        <div className="row justify-content-center">
          {featuredLawyers.map((lawyer) => (
            <div
              key={lawyer.lawyer_id}
              className="col-lg-4 col-md-6 mb-4 d-flex justify-content-center"
            >
              <div
                className="card border-0 shadow-sm rounded-4"
                style={{ width: "18rem", backgroundColor: "white" }}
              >
                <div className="text-center mt-3">
                  <img
                    src={`/${lawyer.image}`}
                    alt={lawyer.name}
                    className="rounded-circle shadow-sm"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title text-primary fw-bold mt-2">
                    {lawyer.name}
                  </h5>
                  <p className="text-muted mb-1">{lawyer.city}</p>
                  <p className="small text-secondary">
                    ⭐ {lawyer.rating} / 5 | {lawyer.experience_years} năm KN
                  </p>
                  <button className="btn btn-warning btn-sm fw-semibold">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedLawyers;
