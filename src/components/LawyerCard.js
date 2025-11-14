// src/components/LawyerCard.jsx
import { Link } from "react-router-dom";

function LawyerCard({ lawyer }) {
  return (
    <div className="card border-0 shadow-sm rounded-4" style={{ width: "18rem", backgroundColor: "white" }}>
      <div className="text-center mt-3">
        <img
          src={lawyer.image || "/default-avatar.png"}
          alt={lawyer.name}
          className="rounded-circle shadow-sm"
          style={{ width: "120px", height: "120px", objectFit: "cover" }}
        />
      </div>
      <div className="card-body text-center">
        <h5 className="card-title text-primary fw-bold mt-2">{lawyer.name}</h5>
        <p className="text-muted mb-1">{lawyer.city}</p>
        <p className="small text-secondary">
          ⭐ {lawyer.rating?.toFixed(1) || 0} / 5 | {lawyer.experience_years || 0} năm KN
        </p>
        <Link to={`/lawyer/${lawyer.id}`} className="btn btn-warning btn-sm fw-semibold">
          View Profile
        </Link>
      </div>
    </div>
  );
}

export default LawyerCard;
