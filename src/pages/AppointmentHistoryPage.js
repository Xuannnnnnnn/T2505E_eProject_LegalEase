import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaUserTie, FaCalendarAlt, FaMoneyBill, FaStickyNote } from "react-icons/fa";

function AppointmentHistoryPage() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    // 🟢 Lấy toàn bộ appointments từ db.json
    fetch("http://localhost:3001/appointments")
      .then((res) => res.json())
      .then(async (allAppointments) => {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!user) return;

        // 🟢 Lấy danh sách luật sư để hiển thị tên
        const resLawyers = await fetch("http://localhost:3001/lawyers");
        const allLawyers = await resLawyers.json();

        // 🟢 Lọc theo customer hiện tại
        const userAppointments = allAppointments
          .filter((a) => a.customer_id === user.id)
          .map((a) => {
            const lawyer = allLawyers.find((l) => l.id === a.lawyer_id);
            return {
              ...a,
              lawyer_name: lawyer ? lawyer.name : "Unknown Lawyer",
              total_price: a.total_price ?? 0,
              slot_duration: a.slot_duration ?? 60,
              appointment_date: a.appointment_date || "N/A",
              appointment_time: a.appointment_time || "N/A",
              notes: a.notes || "-",
            };
          })
          .sort((a, b) => {
            const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
            const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
            return dateB - dateA; // mới nhất lên trên
          });

        setAppointments(userAppointments);
      })
      .catch((err) => console.error("Error loading appointments:", err));
  }, []);

  return (
    <>
      <Header />
      <div className="container my-5">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-header bg-primary text-white text-center">
            <h4>Appointment History</h4>
          </div>
          <div className="card-body">
            {appointments.length === 0 ? (
              <p className="text-center text-muted">No appointments yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Lawyer</th>
                      <th>Date</th>
                      <th>Duration</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Notes</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <FaUserTie className="me-2 text-primary" />
                          {a.lawyer_name}
                        </td>
                        <td>
                          <FaCalendarAlt className="me-2 text-success" />
                          {a.appointment_date}
                        </td>
                        <td>{a.slot_duration} min</td>
                        <td>
                          <FaMoneyBill className="me-2 text-success" />${a.total_price.toFixed(2)}
                        </td>
                        <td className="text-primary">{a.status}</td>
                        <td>
                          <FaStickyNote className="me-2 text-secondary" />
                          {a.notes}
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="info"
                            onClick={() => setSelectedAppointment(a)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal chi tiết cuộc hẹn */}
      {selectedAppointment && (
        <Modal show={true} onHide={() => setSelectedAppointment(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Appointment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Lawyer:</strong> {selectedAppointment.lawyer_name}
            </p>
            <p>
              <strong>Date:</strong> {selectedAppointment.appointment_date}
            </p>
            <p>
              <strong>Time:</strong> {selectedAppointment.appointment_time}
            </p>
            <p>
              <strong>Duration:</strong> {selectedAppointment.slot_duration} min
            </p>
            <p>
              <strong>Total:</strong> ${selectedAppointment.total_price.toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong> {selectedAppointment.status}
            </p>
            <p>
              <strong>Notes:</strong> {selectedAppointment.notes}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedAppointment(null)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Footer />
    </>
  );
}

export default AppointmentHistoryPage;
