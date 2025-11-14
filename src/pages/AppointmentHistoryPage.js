// src/pages/AppointmentHistoryPage.jsx
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

        const [resAppointments, resTransactions, resLawyers] = await Promise.all([
          fetch(`${BASE_URL}/appointments`),
          fetch(`${BASE_URL}/transactions`),
          fetch(`${BASE_URL}/lawyers`),
        ]);

        const allAppointments = await resAppointments.json();
        const allTransactions = await resTransactions.json();
        const allLawyers = await resLawyers.json();

        // Thứ tự trạng thái
        const statusOrder = {
          pending: 1,
          approved: 2,
          completed: 2,
          rejected: 3,
          declined: 3,
        };

        const userAppointments = allAppointments
          .filter((a) => a.customer_id === user.id)
          .map((a) => {
            const lawyer = allLawyers.find((l) => String(l.id) === String(a.lawyer_id));
            const transaction = allTransactions.find((t) => t.appointment_id === a.id);

            return {
              ...a,
              lawyer_details: lawyer || null,
              lawyer_name: lawyer ? lawyer.name : "Unknown Lawyer",
              total_price: transaction ? transaction.amount : a.total_price ?? 0,
              transaction_status: transaction ? transaction.status : "Pending",
              slot_duration: a.slot_duration ?? 60,
              appointment_date: a.appointment_date || "N/A",
              appointment_time: a.appointment_time || "N/A",
              notes: a.notes || "No message provided.",
            };
          })
          .sort((a, b) => {
            const statusA = statusOrder[a.status] || 99;
            const statusB = statusOrder[b.status] || 99;

            if (statusA !== statusB) return statusA - statusB;

            // Nếu cùng trạng thái
            const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
            const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);

            if (a.status === "pending") {
              // Pending: ngày gần nhất lên trên
              return dateA - dateB;
            } else {
              // Các trạng thái khác: ngày xa nhất lên trên
              return dateB - dateA;
            }
          });

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
                        <td
                          className={
                            a.status === "pending"
                              ? "text-warning fw-bold"
                              : a.status === "approved" || a.status === "completed"
                              ? "text-success fw-bold"
                              : "text-danger fw-bold"
                          }
                        >
                          {a.status}
                        </td>
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

        {selectedAppointment && (
          <Modal show={true} onHide={() => setSelectedAppointment(null)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Appointment Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5 className="mb-2 text-primary">
                <FaUserTie className="me-2" />
                Lawyer Information
              </h5>
              <div className="border rounded p-3 mb-4 bg-light">
                {selectedAppointment.lawyer_details ? (
                  <>
                    <p className="mb-1">
                      <strong>Name:</strong> {selectedAppointment.lawyer_details.name}
                    </p>
                    <p className="mb-1">
                      <strong>Email:</strong> {selectedAppointment.lawyer_details.email || "N/A"}
                    </p>
                    <p className="mb-1">
                      <strong>Specialty/Summary:</strong> {selectedAppointment.lawyer_details.profile_summary || "Not specified"}
                    </p>
                  </>
                ) : (
                  <p className="text-muted mb-0">Lawyer details not available.</p>
                )}
              </div>

              <h5 className="mb-2 text-primary">
                <FaCalendarAlt className="me-2" />
                Appointment & Payment
              </h5>
              <div className="border rounded p-3 mb-4">
                <p className="mb-1">
                  <strong>Date & Time:</strong> {selectedAppointment.appointment_date} @ {selectedAppointment.appointment_time}
                </p>
                <p className="mb-1">
                  <strong>Duration:</strong> {selectedAppointment.slot_duration} min
                </p>
                <p className="mb-1">
                  <strong>Total Price:</strong> <span className="text-success fw-bold">${selectedAppointment.total_price.toFixed(2)}</span>
                </p>
                <p className="mb-1">
                  <strong>Status:</strong>{" "}
                  <span className={
                    selectedAppointment.status === "pending"
                      ? "text-warning fw-bold"
                      : selectedAppointment.status === "approved" || selectedAppointment.status === "completed"
                      ? "text-success fw-bold"
                      : "text-danger fw-bold"
                  }>
                    {selectedAppointment.status}
                  </span>
                </p>
                <p className="mb-0">
                  <strong>Payment Status:</strong>{" "}
                  <span className={
                    selectedAppointment.transaction_status === "Success"
                      ? "text-success fw-bold"
                      : "text-danger fw-bold"
                  }>
                    {selectedAppointment.transaction_status}
                  </span>
                </p>
              </div>

              <h5 className="mb-2 text-primary">
                <FaStickyNote className="me-2" />
                Customer Message
              </h5>
              <div className="alert alert-secondary p-3 mb-0">
                {selectedAppointment.notes}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setSelectedAppointment(null)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
      <Footer />
    </>
  );
}

export default AppointmentHistoryPage;
