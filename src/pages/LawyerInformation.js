import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import lawyers from "../data/lawyers.json";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaCalendarAlt } from "react-icons/fa";

// Component hiển thị lịch slot
const CustomerSchedule = ({ lawyerId, selectedDate, onSelectSlot }) => {
  const [slotsStatus, setSlotsStatus] = useState({});
  const slots = ["09:00", "11:00", "14:00", "16:00"];

  useEffect(() => {
    const schedules = JSON.parse(localStorage.getItem("lawyerSchedules")) || {};
    setSlotsStatus(schedules[selectedDate] || {});
  }, [selectedDate, lawyerId]);

  return (
    <div className="mb-3">
      <label>Select Time Slot:</label>
      <div className="d-flex flex-wrap gap-2 mt-2">
        {slots.map((slot) => {
          const status = slotsStatus[slot] || "available";
          return (
            <button
              key={slot}
              type="button"
              className={`btn ${
                status === "available" ? "btn-outline-primary" : "btn-secondary disabled"
              }`}
              onClick={() => onSelectSlot(slot, selectedDate)}
            >
              {slot} ({status})
            </button>
          );
        })}
      </div>
    </div>
  );
};

function LawyerInformation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lawyer = lawyers.find((l) => l.lawyer_id === parseInt(id));

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [form, setForm] = useState({
    appointment_date: "",
    appointment_time: "",
    slot_duration: 60,
    total_price: 0,
    notes: "",
  });

  // ✅ useEffect luôn ở cấp cao nhất, không gọi conditionally
  useEffect(() => {
    if (!lawyer) return;

    const pending = JSON.parse(localStorage.getItem("pendingAppointment"));
    if (pending) {
      setForm((prev) => ({
        ...prev,
        ...pending,
        total_price: (lawyer.hourly_rate * pending.slot_duration) / 60,
      }));
      localStorage.removeItem("pendingAppointment");
      setShowModal(true);
    }
  }, [lawyer]);

  // Nếu lawyer không tồn tại → render fallback
  if (!lawyer) {
    return (
      <div className="container text-center py-5">
        <h3 className="text-danger">Lawyer not found.</h3>
        <Link to="/search" className="btn btn-outline-primary mt-3">
          Back
        </Link>
      </div>
    );
  }

  // Chọn slot lịch
  const handleSelectSlot = (slot, date) => {
    const total = (lawyer.hourly_rate * form.slot_duration) / 60;
    setForm({
      ...form,
      appointment_date: date,
      appointment_time: slot,
      total_price: total,
    });

    const customer = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!customer) {
      // Chưa login → redirect sang Login page
      navigate("/login", {
        state: {
          redirectBack: `/lawyer/${lawyer.lawyer_id}`,
          appointmentForm: {
            appointment_date: date,
            appointment_time: slot,
            slot_duration: form.slot_duration,
          },
        },
      });
      return;
    }

    setShowModal(true);
  };

  // Xử lý submit appointment
  const handleSubmit = () => {
    const customer = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!customer) {
      alert("Please login first.");
      return;
    }

    const newAppointment = {
      lawyer_id: lawyer.lawyer_id,
      lawyer_name: lawyer.name,
      customer_id: customer.customer_id,
      customer_name: customer.fullname,
      appointment_date: form.appointment_date,
      appointment_time: form.appointment_time,
      slot_duration: parseInt(form.slot_duration),
      hourly_rate: lawyer.hourly_rate,
      total_price: parseFloat(form.total_price),
      notes: form.notes,
      status: "pending",
    };

    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    appointments.push(newAppointment);
    localStorage.setItem("appointments", JSON.stringify(appointments));

    // Cập nhật lịch bận của luật sư
    const schedules = JSON.parse(localStorage.getItem("lawyerSchedules")) || {};
    const daySchedule = schedules[form.appointment_date] || {};
    daySchedule[form.appointment_time] = "busy";
    schedules[form.appointment_date] = daySchedule;
    localStorage.setItem("lawyerSchedules", JSON.stringify(schedules));

    alert(
      `✅ Appointment confirmed with ${lawyer.name}\nDate: ${form.appointment_date} ${form.appointment_time}\nTotal: $${form.total_price.toFixed(
        2
      )}`
    );

    navigate("/payment", { state: { appointment: newAppointment } });
    setShowModal(false);
  };

  return (
    <>
      <Header />
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
              <p className="fw-semibold text-success">
                ${lawyer.hourly_rate}/hour
              </p>
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

        {/* Modal Book Appointment */}
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
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                    />

                    <CustomerSchedule
                      lawyerId={lawyer.lawyer_id}
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
                      onChange={(e) =>
                        setForm({ ...form, notes: e.target.value })
                      }
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
      <Footer />
    </>
  );
}

export default LawyerInformation;
