import React, { useEffect, useState } from "react";
import AppointmentsTable from "../components/AppointmentsTable";

const LawyerAppointments = ({ lawyerId }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("appointments")) || [];
    const filtered = stored.filter(a => a.lawyer_id === lawyerId);
    setAppointments(filtered);
  }, [lawyerId]);

  const handleApprove = (a) => {
    const updated = appointments.map(item =>
      item.customer_id === a.customer_id && item.appointment_time === a.appointment_time
        ? { ...item, status: "approved" }
        : item
    );
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
  };

  const handleReject = (a) => {
    const updated = appointments.map(item =>
      item.customer_id === a.customer_id && item.appointment_time === a.appointment_time
        ? { ...item, status: "rejected" }
        : item
    );
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
  };

  return (
    <div className="container my-5">
      <h4 className="mb-3 fw-bold text-primary">Your Appointments</h4>
      <AppointmentsTable
        appointments={appointments}
        role="lawyer"
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default LawyerAppointments;
