import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

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

  if (loading) {
    return (
      <section className="py-5 text-center">
        <h5>Loading featured lawyers...</h5>
      </section>
    );
  }

  // Shuffle array
  const shuffleArray = (array) => {
    return array
      .map((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);
  };

  // Lấy 9 luật sư ngẫu nhiên để chia thành slide
  const topLawyers = shuffleArray(lawyers).slice(0, 9);

  // Chia thành 3 slide
  const slides = [];
  for (let i = 0; i < 9; i += 3) {
    slides.push(topLawyers.slice(i, i + 3));
  }

  return (
    <section className="py-3" style={{ backgroundColor: "#f4f7f9" }}>
      <div className="container">
        <h2 className="mb-3 fw-bold text-primary text-center">
          Featured Lawyers
        </h2>

        <Carousel indicators={false}>
          {slides.map((slideGroup, idx) => (
            <Carousel.Item key={idx}>
              <div className="d-flex justify-content-center flex-wrap gap-3">
                {slideGroup.map((lawyer) => (
                  <div
                      key={lawyer.id}
                      className="card border-0 shadow-sm rounded-4 p-3 mb-3 d-flex flex-column"
                      style={{ width: "100%", maxWidth: "500px", flex: "1 1 250px" }}
                    >
                      <div className="text-center mb-3">
                        <img
                          src={lawyer.image}
                          alt={lawyer.name}
                          className="rounded-circle"
                          style={{
                            width: "110px",
                            height: "110px",
                            objectFit: "cover",
                            border: "4px solid #f0f0f0",
                          }}
                        />
                      </div>

                      <h5 className="text-primary fw-bold text-center">{lawyer.name}</h5>
                      <p className="fw-semibold text-muted text-center">{lawyer.specialization}</p>

                      <p
                        className="small text-secondary text-center flex-grow-1"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: "1.2em",
                          maxHeight: "3.6em", // 3 dòng * 1.2em
                          marginBottom: "0.5rem",
                        }}
                      >
                        {lawyer.profile_summary || ""}
                      </p>

                      <p className="text-muted mb-1 text-center">📍 {lawyer.city}</p>
                      <p className="small text-secondary text-center">
                        ⭐ {lawyer.rating} / 5 | {lawyer.experience_years} năm KN
                      </p>

                      <Link
                        to={`/lawyer/${lawyer.id}`}
                        className="btn btn-warning fw-semibold mt-auto" // mt-auto đẩy xuống cuối card
                      >
                        View Profile
                      </Link>
                    </div>

                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

export default FeaturedLawyers;
