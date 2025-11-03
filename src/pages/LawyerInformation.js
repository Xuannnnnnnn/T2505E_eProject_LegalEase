import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaCalendarAlt } from "react-icons/fa";

const BASE_URL = "http://localhost:3001"; // ⚙️ JSON Server base URL

// Component hiển thị lịch slot
const CustomerSchedule = ({ lawyerId, selectedDate, onSelectSlot }) => {
  const [slotsStatus, setSlotsStatus] = useState({});
  const slots = ["09:00", "11:00", "14:00", "16:00"];

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await fetch(`${BASE_URL}/appointments?lawyer_id=${lawyerId}&appointment_date=${selectedDate}`);
        const appointments = await res.json();

        // Đánh dấu các slot đã bận
        const status = {};
        appointments.forEach((a) => {
          status[a.appointment_time] = "busy";
        });
        setSlotsStatus(status);
      } catch (error) {
        console.error("Error loading schedule:", error);
      }
    };
    fetchSlots();
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
              onClick={() => status === "available" && onSelectSlot(slot, selectedDate)}
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

  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [form, setForm] = useState({
    appointment_date: "",
    appointment_time: "",
    slot_duration: 60,
    total_price: 0,
    notes: "",
  });

  // 🔹 Lấy thông tin luật sư từ db.json (JSON Server)
  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const res = await fetch(`${BASE_URL}/lawyers?id=${id}`);
          const data = await res.json();
          const lawyerData = data[0]; // vì JSON Server trả mảng khi tìm bằng ?id=

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

  // Nếu đang tải
  if (loading) {
    return (
      <div className="container text-center py-5">
        <h4>Loading...</h4>
      </div>
    );
  }

  // Nếu luật sư không tồn tại hoặc chưa được duyệt
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

  // ✅ Chọn slot lịch
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
          redirectBack: `/lawyer/${lawyer.id}`,
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

  // ✅ Xử lý submit appointment → lưu vào db.json
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
        alert(
          `✅ Appointment confirmed with ${lawyer.name}\nDate: ${form.appointment_date} ${form.appointment_time}\nTotal: $${form.total_price.toFixed(
            2
          )}`
        );
        navigate("/payment", { state: { appointment: newAppointment } });
        setShowModal(false);
      } else {
        alert("❌ Failed to save appointment.");
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
    }
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
              <p className="fw-semibold text-success">${lawyer.hourly_rate}/hour</p>
              <p>{lawyer.profile_summary}</p>

              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
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
