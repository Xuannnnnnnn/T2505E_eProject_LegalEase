import React, { useState, useEffect } from "react";

const CustomerSchedule = ({ lawyerId, onSelectSlot }) => {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (!date) return;
    const savedSlots = JSON.parse(localStorage.getItem(`lawyerSlots_${lawyerId}_${date}`)) || [];
    setSlots(savedSlots);
  }, [date, lawyerId]);

  return (
    <div>
      <label>Date:</label>
      <input type="date" className="form-control mb-2" value={date} onChange={(e) => setDate(e.target.value)} />

      {date && slots.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-3">
          {slots.map((slot, idx) => (
            <button
              key={idx}
              className={`btn ${slot.status === "available" ? "btn-outline-primary" : "btn-secondary"}`}
              disabled={slot.status !== "available"}
              onClick={() => onSelectSlot(slot.time, date)}
            >
              {slot.time}
            </button>
          ))}
        </div>
      )}
      {date && slots.length === 0 && <p>No slots configured for this date.</p>}
    </div>
  );
};

export default CustomerSchedule;
