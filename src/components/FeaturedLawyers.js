import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // 🟢 Thêm dòng này

function FeaturedLawyers() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://localhost:3001";

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/lawyers`);
        const data = await res.json();
        const approved = data.filter((l) => l.status === "Approved");
        setLawyers(approved);
      } catch (error) {
        console.error("Error fetching lawyers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  const featuredLawyers = lawyers.slice(0, 3);

  if (loading) {
    return (
      <section className="py-5 text-center">
        <h5>Loading featured lawyers...</h5>
      </section>
    );
  }

  return (
    <section className="py-5" style={{ backgroundColor: "#fafcf9" }}>
      <div className="container text-center">
        <h2 className="mb-5 fw-bold text-primary">Featured Lawyers</h2>

        <div className="row justify-content-center">
          {featuredLawyers.length > 0 ? (
            featuredLawyers.map((lawyer) => (
              <div
                key={lawyer.id}
                className="col-lg-4 col-md-6 mb-4 d-flex justify-content-center"
              >
                <div
                  className="card border-0 shadow-sm rounded-4"
                  style={{ width: "18rem", backgroundColor: "white" }}
                >
                  <div className="text-center mt-3">
                    <img
                      src={`${lawyer.image}`}
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
                    {/* 🟢 Chuyển button thành Link */}
                    <Link
                      to={`/lawyer/${lawyer.id}`}
                      className="btn btn-warning btn-sm fw-semibold"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No approved lawyers available yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default FeaturedLawyers;
