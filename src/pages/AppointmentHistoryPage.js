import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserTie, FaCalendarAlt, FaMoneyBill, FaStickyNote } from "react-icons/fa";

function AppointmentHistoryPage() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("appointments")) || [];
    setAppointments(stored);
  }, []);

  return (
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
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a, index) => (
                    <tr key={a.id}>
                      <td>{index + 1}</td>
                      <td><FaUserTie className="me-2 text-primary" />{a.lawyer_name}</td>
                      <td><FaCalendarAlt className="me-2 text-success" />{a.appointment_date}</td>
                      <td>{a.slot_duration} min</td>
                      <td><FaMoneyBill className="me-2 text-success" />${a.total_price}</td>
                      <td className="text-primary">{a.status}</td>
                      <td><FaStickyNote className="me-2 text-secondary" />{a.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppointmentHistoryPage;
