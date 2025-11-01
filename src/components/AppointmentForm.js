import React, { useState } from "react";

const AppointmentForm = ({ customer, onNewAppointment }) => {
  const [lawyerId, setLawyerId] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!lawyerId || !appointmentTime) {
      alert("Please select a lawyer and time.");
      return;
    }

    const newAppointment = {
      lawyer_id: parseInt(lawyerId),
      customer_id: customer.customer_id,
      appointment_time: appointmentTime,
      status: "pending",
    };

    onNewAppointment(newAppointment);
    setLawyerId("");
    setAppointmentTime("");
    alert("Appointment booked successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="border p-3 rounded bg-light">
      <div className="mb-3">
        <label className="form-label">Lawyer ID</label>
        <input
          type="number"
          className="form-control"
          value={lawyerId}
          onChange={(e) => setLawyerId(e.target.value)}
          placeholder="Enter lawyer ID"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Appointment Time</label>
        <input
          type="datetime-local"
          className="form-control"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Book Appointment
      </button>
    </form>
  );
};

export default AppointmentForm;
