// src/components/CustomerSchedule.jsx
import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:3001";

const defaultSlots = [
  { time: "09:00", available: true },
  { time: "11:00", available: true },
  { time: "14:00", available: true },
  { time: "16:00", available: true },
];

const markAndFilterSlots = (date, slotList, appointments = []) => {
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date();

  return slotList
    .map((slot) => {
      const slotTime = new Date(`${date}T${slot.time}:00`);
      const dateOnly = new Date(`${date}T00:00:00`);
      const todayOnly = new Date(`${today}T00:00:00`);

      if (dateOnly < todayOnly) return null; // ngày cũ
      if (date === today && slotTime < now) return null; // slot đã qua

      const booked = appointments.some(
        (a) => a.appointment_time === slot.time && a.status !== "cancelled"
      );

      return {
        time: slot.time,
        available: Boolean(slot.available) && !booked,
      };
    })
    .filter(Boolean);
};

const CustomerSchedule = ({ lawyerId, selectedDate, onSelectSlot, selectedSlot }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lawyerId || !selectedDate) return;
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const [schedRes, apptRes] = await Promise.all([
          fetch(`${API_BASE}/schedules?lawyer_id=${lawyerId}&date=${selectedDate}`),
          fetch(`${API_BASE}/appointments?lawyer_id=${lawyerId}&appointment_date=${selectedDate}`),
        ]);
        const schedData = (await schedRes.json()) || [];
        const appts = (await apptRes.json()) || [];
        const configured = schedData.length > 0 ? schedData[0].slots : defaultSlots;
        const processed = markAndFilterSlots(selectedDate, configured, appts);
        if (mounted) setSlots(processed);
      } catch (err) {
        console.error("CustomerSchedule load error:", err);
        if (mounted) setSlots([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => (mounted = false);
  }, [lawyerId, selectedDate]);

  return (
    <div className="mb-3">
      <label className="fw-bold">Select Time Slot:</label>
      {loading ? (
        <p>Loading slots...</p>
      ) : slots.length === 0 ? (
        <p className="text-danger">No available slots.</p>
      ) : (
        <div className="d-flex flex-wrap gap-2 mt-2">
          {slots.map((s) => {
            const isSelected = selectedSlot === s.time;
            return (
              <button
                key={s.time}
                className={`btn ${
                  s.available
                    ? isSelected
                      ? "btn-primary" // highlight slot đang chọn
                      : "btn-outline-primary"
                    : "btn-secondary disabled"
                }`}
                disabled={!s.available}
                onClick={() => s.available && onSelectSlot(s.time, selectedDate)}
              >
                {s.time} {s.available ? "(available)" : "(busy)"}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerSchedule;
