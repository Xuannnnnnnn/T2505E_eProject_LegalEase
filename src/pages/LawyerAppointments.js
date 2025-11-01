import React, { useEffect, useState } from "react";
import AppointmentsTable from "../components/AppointmentsTable";

const LawyerAppointments = ({ lawyerId }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("appointments")) || [];
    const filtered = stored.filter(a => Number(a.lawyer_id) === Number(lawyerId));
    setAppointments(filtered);
  }, [lawyerId]);

  const updateStatus = (a, status) => {
    const updated = appointments.map(item =>
      Number(item.lawyer_id) === Number(a.lawyer_id) &&
      Number(item.customer_id) === Number(a.customer_id) &&
      item.appointment_date === a.appointment_date &&
      item.appointment_time === a.appointment_time
        ? { ...item, status }
        : item
    );
    setAppointments(updated);

    const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const merged = allAppointments.map(item =>
      Number(item.lawyer_id) === Number(a.lawyer_id) &&
      Number(item.customer_id) === Number(a.customer_id) &&
      item.appointment_date === a.appointment_date &&
      item.appointment_time === a.appointment_time
        ? { ...item, status }
        : item
    );
    localStorage.setItem("appointments", JSON.stringify(merged));
  };

  const handleApprove = (a) => updateStatus(a, "approved");
  const handleReject = (a) => updateStatus(a, "rejected");

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
