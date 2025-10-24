import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import lawyers from "../data/lawyers.json";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaCalendarAlt } from "react-icons/fa";

// Component hiển thị lịch slot cho khách chọn (dựa vào luật sư đã cấu hình)
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
  const [showLogin, setShowLogin] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [form, setForm] = useState({
    appointment_date: "",
    appointment_time: "",
    slot_duration: 60,
    total_price: 0,
    notes: "",
  });

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
  };

  // Xử lý submit appointment
  const handleSubmit = () => {
    const customer = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!customer) {
      setShowLogin(true);
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

    // Khi khách đặt slot thành công → tự động đánh dấu bận trong lịch luật sư
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

  // Modal login
  const LoginModal = ({ onClose, onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
      e.preventDefault();
      const customers = JSON.parse(localStorage.getItem("customers")) || [];
      const user = customers.find(
        (c) => c.email === email && c.password === password
      );

      if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        onLoginSuccess();
        onClose();
      } else {
        alert("Email hoặc mật khẩu không đúng!");
      }
    };

    return (
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-3 rounded-4">
            <h5>Login to Continue</h5>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                className="form-control mb-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="form-control mb-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
              <button
                type="button"
                className="btn btn-secondary w-100 mt-2"
                onClick={onClose}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
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

        {/* Modal Login */}
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onLoginSuccess={handleSubmit}
          />
        )}
      </div>
      <Footer />
    </>
  );
}

export default LawyerInformation;
