import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import lawyers from "../data/lawyers.json";
import categories from "../data/categories.json";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaMoneyBill, FaCalendarAlt } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";

function LawyerInformation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lawyer = lawyers.find((l) => l.lawyer_id === parseInt(id));
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    appointment_date: "",
    appointment_time: "",
    specialization_id: "",
    slot_duration: 0,
    total_price: 0,
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
    if (name === "slot_duration") {
      const total = (lawyer.hourly_rate * value) / 60;
      newForm.total_price = total;
    }
    setForm(newForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fullDateTime = `${form.appointment_date}T${form.appointment_time}`;
    const appointmentData = {
      lawyer_id: lawyer.lawyer_id,
      lawyer_name: lawyer.name,
      specialization_id: parseInt(form.specialization_id),
      appointment_date: fullDateTime,
      slot_duration: parseInt(form.slot_duration),
      hourly_rate: lawyer.hourly_rate,
      total_price: parseFloat(form.total_price),
      status: "pending",
      notes: form.notes,
    };

    alert(
      `✅ Appointment confirmed with ${lawyer.name}\nDate: ${form.appointment_date} ${form.appointment_time}\nTotal: $${form.total_price.toFixed(2)}`
    );

    navigate("/payment", { state: { appointment: appointmentData } });
    setShowModal(false);
  };

  if (!lawyer)
    return (
      <div className="container text-center py-5">
        <h3 className="text-danger">Lawyer not found.</h3>
        <Link to="/search" className="btn btn-outline-primary mt-3">
          Back
        </Link>
      </div>
    );

  return (
    <>
    <Header/>
      <div className="container my-5">
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
          <div className="row g-0">
            <div className="col-md-5">
              <img
                src={`/${lawyer.image}`}
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

              <button
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                <FaCalendarAlt className="me-2" /> Book Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 rounded-4">
                <div className="modal-header bg-primary text-white">
                  <h5>Book Appointment with {lawyer.name}</h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <label>Date</label>
                    <input
                      type="date"
                      className="form-control mb-3"
                      name="appointment_date"
                      value={form.appointment_date}
                      onChange={handleChange}
                      required
                    />

                    <label>Time</label>
                    <input
                      type="time"
                      className="form-control mb-3"
                      name="appointment_time"
                      value={form.appointment_time}
                      onChange={handleChange}
                      required
                    />

                    <label>Duration (minutes)</label>
                    <input
                      type="number"
                      className="form-control mb-3"
                      name="slot_duration"
                      min="0"
                      step="30"
                      value={form.slot_duration}
                      onChange={handleChange}
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
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Confirm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
}

export default LawyerInformation;
