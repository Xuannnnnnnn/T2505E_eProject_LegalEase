import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function LawyerDetail() {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://localhost:3001";

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const res = await fetch(`${BASE_URL}/lawyers/${id}`);
        const data = await res.json();
        // ✅ Chỉ hiển thị nếu được duyệt
        if (data && data.status === "Approved") {
          setLawyer(data);
        }
      } catch (error) {
        console.error("Error fetching lawyer detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyer();
  }, [id]);

  if (loading)
    return <div className="text-center mt-5">Loading lawyer details...</div>;

  if (!lawyer)
    return (
      <div className="text-center mt-5 text-danger fw-bold">
        ❌ Lawyer not found or not approved by Admin.
      </div>
    );

  return (
    <div className="container my-5 text-center">
      <img
        src={`/${lawyer.image}`}
        alt={lawyer.name}
        className="rounded-circle shadow-sm mb-3"
        style={{ width: "150px", height: "150px", objectFit: "cover" }}
      />
      <h2 className="fw-bold text-primary">{lawyer.name}</h2>
      <p className="text-muted">{lawyer.city}</p>
      <p className="text-secondary">⭐ {lawyer.rating} / 5</p>
      <p className="mt-3">{lawyer.profile_summary || "No profile summary."}</p>
    </div>
  );
}

export default LawyerDetail;
