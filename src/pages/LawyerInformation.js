// src/pages/LawyerInformation.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomerSchedule from "../components/CustomerSchedule";
import { FaCalendarAlt } from "react-icons/fa";

const BASE_URL = "http://localhost:3001";

function LawyerInformation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false); // ✅ Modal chi tiết
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [appointments, setAppointments] = useState([]);

  const [form, setForm] = useState({
    appointment_date: "",
    appointment_time: "",
    slot_duration: 60,
    total_price: 0,
    notes: "",
  });

  // =============================
  // Lấy thông tin luật sư
  // =============================
  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const res = await fetch(`${BASE_URL}/lawyers?id=${id}`);
        const data = await res.json();
        const lawyerData = data[0];

        if (!lawyerData || lawyerData.status !== "Approved") {
          setLawyer(null);
        } else {
          setLawyer(lawyerData);
        }
      } catch (err) {
        console.error(err);
        setLawyer(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyer();
  }, [id]);

  // =============================
  // Lấy appointment
  // =============================
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${BASE_URL}/appointments?lawyer_id=${id}`);
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAppointments();
  }, [id]);

  // =============================
  // Check pendingAppointment
  // =============================
  useEffect(() => {
    if (!lawyer) return;
    const pending = JSON.parse(localStorage.getItem("pendingAppointment"));
    if (pending && pending.lawyer_id === id) {
      setForm({
        ...form,
        ...pending,
        total_price: (pending.slot_duration * lawyer.hourly_rate) / 60,
      });
      setSelectedDate(pending.appointment_date);
      setShowModal(true);
      localStorage.removeItem("pendingAppointment");
    }
  }, [lawyer]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <h4>Loading...</h4>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="container text-center py-5">
        <h3 className="text-danger">❌ Lawyer not found or not approved by Admin.</h3>
        <Link to="/search" className="btn btn-outline-primary mt-3">
          Back
        </Link>
      </div>
    );
  }

  // =============================
  // Chọn Slot
  // =============================
  const handleSelectSlot = (slot, date) => {
    const customer = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!customer) {
      navigate("/login", {
        state: {
          redirectBack: `/lawyer/${lawyer.id}`,
          appointmentForm: {
            lawyer_id: lawyer.id,
            appointment_date: date,
            appointment_time: slot,
            slot_duration: form.slot_duration,
          },
        },
      });
      return;
    }

    setForm({
      ...form,
      appointment_date: date,
      appointment_time: slot,
      total_price: (lawyer.hourly_rate * form.slot_duration) / 60,
    });
    setShowModal(true);
  };

  // =============================
  // Submit Appointment
  // =============================
  const handleSubmit = async () => {
    const customer = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!customer) {
      alert("Please login first.");
      return;
    }

    const newAppointment = {
      lawyer_id: lawyer.id,
      lawyer_name: lawyer.name,
      customer_id: customer.id,
      customer_name: customer.fullname,
      appointment_date: form.appointment_date,
      appointment_time: form.appointment_time,
      slot_duration: parseInt(form.slot_duration),
      hourly_rate: lawyer.hourly_rate,
      total_price: parseFloat(form.total_price),
      notes: form.notes,
      status: "pending",
    };

    try {
      const res = await fetch(`${BASE_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAppointment),
      });

      if (res.ok) {
        const saved = await res.json();
        setAppointments([...appointments, saved]);
        alert(`✅ Appointment confirmed with ${lawyer.name}\nDate: ${form.appointment_date} ${form.appointment_time}\nTotal: $${form.total_price.toFixed(2)}`);
        setShowModal(false);
        navigate("/payment", { state: { appointment: saved } });
      } else {
        alert("❌ Failed to save appointment.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // =====================================================
  // =================== RETURN UI ========================
  // =====================================================

  return (
    <>
      <Header />
      <div className="container my-5">

        {/* CARD INFO */}
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
          <div className="row g-0">
            <div className="col-md-5">
              <img
                src={`${lawyer.image}`}
                alt={lawyer.name}
                className="img-fluid h-100 w-100"
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className="col-md-7 p-4">
              <h3 className="fw-bold text-primary">{lawyer.name}</h3>
              <p className="text-muted mb-2">{lawyer.city}</p>
              <p className="fw-semibold text-success">${lawyer.hourly_rate}/hour</p>
              <p>{lawyer.profile_summary}</p>

              <button className="btn btn-primary me-2" onClick={() => setShowModal(true)}>
                <FaCalendarAlt className="me-2" /> Book Appointment
              </button>

              {/* ⭐ Button View Details */}
              <button className="btn btn-outline-secondary" onClick={() => setShowDetailModal(true)}>
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* ====================== MODAL BOOK APPOINTMENT ====================== */}
        {showModal && (
          <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 rounded-4">
                <div className="modal-header bg-primary text-white">
                  <h5>Book Appointment with {lawyer.name}</h5>
                  <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <div className="modal-body">

                    <label>Select Date:</label>
                    <input
                      type="date"
                      className="form-control mb-3"
                      value={selectedDate}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                    />

                    <CustomerSchedule
                      lawyerId={lawyer.id}
                      selectedDate={selectedDate}
                      onSelectSlot={handleSelectSlot}
                    />

                    <label>Duration (minutes)</label>
                    <input
                      type="number"
                      className="form-control mb-3"
                      min="30"
                      step="30"
                      value={form.slot_duration}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          slot_duration: parseInt(e.target.value),
                          total_price: (lawyer.hourly_rate * e.target.value) / 60,
                        })
                      }
                      required
                    />

                    <label>Total Price ($)</label>
                    <input
                      type="text"
                      className="form-control mb-3 fw-bold text-success"
                      value={form.total_price.toFixed(2)}
                      disabled
                    />

                    <label>Notes</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Confirm</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ===================== MODAL VIEW DETAILS ================= */}
        {/* ========================================================= */}
        {showDetailModal && (
          <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0 rounded-4">

                <div className="modal-header">
                  <h4 className="fw-bold">{lawyer.name}</h4>
                  <button className="btn-close" onClick={() => setShowDetailModal(false)}></button>
                </div>

                <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>

                  <div className="text-center mb-3">
                    <img
                      src={lawyer.image}
                      alt={lawyer.name}
                      className="rounded-circle mb-2"
                      width={110}
                      height={110}
                      style={{ objectFit: "cover" }}
                    />
                    <h5 className="fw-bold mt-2">{lawyer.name}</h5>
                    <p className="text-muted">{lawyer.city}</p>
                    <p className="fw-semibold">{lawyer.specialization || "Family Law"}</p>
                  </div>

                  {/* Rating */}
                  <h6 className="fw-bold">
                    Rating ({lawyer.review_count || 21} users)
                  </h6>

                  <p className="fs-5 text-warning">
                    {"★".repeat(Math.round(lawyer.rating || 5))}
                    {"☆".repeat(5 - Math.round(lawyer.rating || 5))}
                  </p>

                  <div className="row mb-3">
                    <div className="col-6">Good value for money</div>
                    <div className="col-6 text-end text-warning">★★★★★</div>

                    <div className="col-6">Would hire again</div>
                    <div className="col-6 text-end">100%</div>

                    <div className="col-6">Would recommend to friend</div>
                    <div className="col-6 text-end">100%</div>
                  </div>

                  <hr />

                  {/* Reviews list */}
                  {lawyer.reviews?.map((r, index) => (
                    <div key={index} className="mb-4">
                      <p className="text-warning mb-1">★★★★★</p>
                      <p className="fw-bold mb-1">
                        by {r.author}, {r.date}
                      </p>
                      <p>{r.content}</p>
                      <hr />
                    </div>
                  ))}

                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>
                    Close
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </>
  );
}

export default LawyerInformation;
