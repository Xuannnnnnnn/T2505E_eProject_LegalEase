import React, { useState } from "react";

const AppointmentForm = ({ lawyer, customer, onNewAppointment }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const slots = ["09:00", "11:00", "14:00", "16:00"];

  const handleBook = (e) => {
    e.preventDefault();

    if (!lawyer) {
      alert("Please select a lawyer before booking an appointment.");
      return;
    }
    if (!selectedDate || !selectedSlot) {
      alert("Please select a date and time slot.");
      return;
    }

    const newAppointment = {
      appointment_id: Date.now(),
      lawyer_id: lawyer.lawyer_id,
      lawyer_name: lawyer.name,
      lawyer_specialization: lawyer.specialization || "General",
      customer_id: customer.customer_id,
      customer_name: customer.name,
      appointment_date: selectedDate,
      appointment_time: selectedSlot,
      slot_duration: 60,
      total_price: lawyer.hourly_rate,
      status: "pending",
    };

    onNewAppointment(newAppointment);
    alert("Appointment booked successfully!");

    setSelectedDate("");
    setSelectedSlot("");
  };

  return (
    <form onSubmit={handleBook} className="border p-3 rounded bg-light">
      <div className="mb-3">
        <label className="form-label">Selected Lawyer</label>
        <input
          type="text"
          className="form-control"
          value={lawyer ? `${lawyer.name} - $${lawyer.hourly_rate}/h` : "No lawyer selected"}
          readOnly
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Select Date</label>
        <input
          type="date"
          className="form-control"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Select Time Slot</label>
        <div className="d-flex gap-2 flex-wrap">
          {slots.map((slot) => (
            <button
              key={slot}
              type="button"
              className={`btn ${selectedSlot === slot ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setSelectedSlot(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn-success mt-3">
        Book Appointment
      </button>
    </form>
  );
};

export default AppointmentForm;
