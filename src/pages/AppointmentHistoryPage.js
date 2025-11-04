import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaUserTie, FaCalendarAlt, FaMoneyBill, FaStickyNote } from "react-icons/fa";

const BASE_URL = "http://localhost:3001";

function AppointmentHistoryPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!user) return;

        // 1️⃣ Lấy toàn bộ appointments
        const resAppointments = await fetch(`${BASE_URL}/appointments`);
        const allAppointments = await resAppointments.json();

        // 2️⃣ Lấy toàn bộ transactions
        const resTransactions = await fetch(`${BASE_URL}/transactions`);
        const allTransactions = await resTransactions.json();

        // 3️⃣ Lấy toàn bộ lawyers
        const resLawyers = await fetch(`${BASE_URL}/lawyers`);
        const allLawyers = await resLawyers.json();

        // 4️⃣ Lọc theo customer hiện tại và kết hợp transactions
        const userAppointments = allAppointments
          .filter((a) => a.customer_id === user.id)
          .map((a) => {
            const lawyer = allLawyers.find((l) => l.id === a.lawyer_id);
            const transaction = allTransactions.find((t) => t.appointment_id === a.id);

            return {
              ...a,
              lawyer_name: lawyer ? lawyer.name : "Unknown Lawyer",
              total_price: transaction ? transaction.amount : a.total_price ?? 0,
              transaction_status: transaction ? transaction.status : "Pending",
              slot_duration: a.slot_duration ?? 60,
              appointment_date: a.appointment_date || "N/A",
              appointment_time: a.appointment_time || "N/A",
              notes: a.notes || "-",
            };
          })
          .sort(
            (a, b) =>
              new Date(`${b.appointment_date}T${b.appointment_time}`) -
              new Date(`${a.appointment_date}T${a.appointment_time}`)
          );

        setAppointments(userAppointments);
      } catch (err) {
        console.error("Error loading appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

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
                      <th>Payment Status</th>
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
                          <FaMoneyBill className="me-2 text-success" />
                          ${a.total_price.toFixed(2)}
                        </td>
                        <td
                          className={
                            a.transaction_status === "Success"
                              ? "text-success"
                              : a.transaction_status === "Failed"
                              ? "text-danger"
                              : "text-warning"
                          }
                        >
                          {a.transaction_status}
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

      {/* Modal chi tiết */}
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
              <strong>Payment Status:</strong>{" "}
              {selectedAppointment.transaction_status}
            </p>
            <p>
              <strong>Appointment Status:</strong> {selectedAppointment.status}
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
