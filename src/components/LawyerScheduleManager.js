// src/components/LawyerScheduleManager.jsx
import React, { useEffect, useState } from "react";
const API_BASE = "http://localhost:3001";

const defaultSlots = [
  { time: "09:00", available: true },
  { time: "11:00", available: true },
  { time: "14:00", available: true },
  { time: "16:00", available: true },
];

// helper: mark expired (date < today OR today & time < now)
const markExpired = (date, slotList) => {
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date();

  return slotList.map((slot) => {
    const slotTime = new Date(`${date}T${slot.time}:00`);
    const dateOnly = new Date(`${date}T00:00:00`);
    const todayOnly = new Date(`${today}T00:00:00`);

    if (dateOnly < todayOnly) return { ...slot, available: false, expired: true };
    if (date === today && slotTime < now) return { ...slot, available: false, expired: true };
    return { ...slot, expired: false, available: slot.available ?? true };
  });
};

const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const LawyerScheduleManager = ({ lawyerId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [slots, setSlots] = useState(defaultSlots);
  const [weeklySchedules, setWeeklySchedules] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE}/appointments?lawyer_id=${lawyerId}`);
      const data = await res.json();
      setAppointments(data || []);
    } catch (err) {
      console.error("fetchAppointments err:", err);
    }
  };

  const fetchScheduleForDate = async (date) => {
    if (!lawyerId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/schedules?lawyer_id=${lawyerId}&date=${date}`);
      const data = await res.json();
      const raw = data.length > 0 ? data[0].slots : defaultSlots;
      let marked = markExpired(date, raw);
      // apply bookings
      marked = marked.map((s) => {
        const booked = appointments.some(
          (a) => String(a.lawyer_id) === String(lawyerId) && a.appointment_date === date && a.appointment_time === s.time && a.status !== "cancelled"
        );
        return { ...s, available: s.available && !booked };
      });
      setSlots(marked);
    } catch (err) {
      console.error(err);
      setSlots(markExpired(date, defaultSlots));
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklySchedules = async (baseDate) => {
    if (!lawyerId) return;
    const start = getStartOfWeek(baseDate);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d.toISOString().split("T")[0];
    });

    try {
      const res = await fetch(`${API_BASE}/schedules?lawyer_id=${lawyerId}`);
      const all = await res.json();
      const week = days.map((day) => {
        const found = all.find((s) => s.date === day);
        const raw = found ? found.slots : defaultSlots;
        let marked = markExpired(day, raw);
        // merge bookings
        marked = marked.map((s) => {
          const booked = appointments.some(
            (a) => String(a.lawyer_id) === String(lawyerId) && a.appointment_date === day && a.appointment_time === s.time && a.status !== "cancelled"
          );
          return { ...s, available: s.available && !booked };
        });
        return { date: day, slots: marked };
      });
      setWeeklySchedules(week);
    } catch (err) {
      console.error("fetchWeeklySchedules err:", err);
    }
  };

  useEffect(() => {
    if (!lawyerId) return;
    const init = async () => {
      await fetchAppointments();
    };
    init();
    // eslint-disable-next-line
  }, [lawyerId]);

  useEffect(() => {
    if (!lawyerId) return;
    fetchScheduleForDate(selectedDate);
    fetchWeeklySchedules(selectedDate);
    // eslint-disable-next-line
  }, [selectedDate, lawyerId, appointments.length]);

  const toggleSlot = (time) => {
    setSlots((prev) => prev.map((s) => (s.time === time && !s.expired ? { ...s, available: !s.available } : s)));
  };

  const saveSchedule = async () => {
    if (!selectedDate || !lawyerId) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/schedules?lawyer_id=${lawyerId}&date=${selectedDate}`);
      const data = await res.json();
      const payload = slots.map(({ time, available }) => ({ time, available }));
      if (data.length > 0) {
        await fetch(`${API_BASE}/schedules/${data[0].id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slots: payload }),
        });
      } else {
        await fetch(`${API_BASE}/schedules`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lawyer_id: lawyerId, date: selectedDate, slots: payload }),
        });
      }
      await fetchWeeklySchedules(selectedDate);
      await fetchAppointments();
      await fetchScheduleForDate(selectedDate);
      alert("✅ Schedule saved");
    } catch (err) {
      console.error("saveSchedule err:", err);
      alert("❌ Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const isSlotBooked = (date, time) => {
    return appointments.some((a) => String(a.lawyer_id) === String(lawyerId) && a.appointment_date === date && a.appointment_time === time && a.status !== "cancelled");
  };

  return (
    <div className="card p-4 shadow-sm border-0">
      <h5 className="mb-3 text-primary fw-bold">Manage Your Schedule</h5>

      <div className="mb-3">
        <label className="form-label fw-semibold">Select Date</label>
        <input
          type="date"
          className="form-control"
          value={selectedDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-muted">Loading schedule...</p>
      ) : (
        <>
          <h6 className="mt-3 mb-2 fw-semibold">Available Slots</h6>
          <div className="d-flex flex-wrap gap-2">
            {slots.length === 0 && <div className="text-muted">No slots configured.</div>}
            {slots.map((s) => (
              <button
                key={s.time}
                className={`btn ${s.expired ? "btn-secondary disabled" : s.available ? "btn-outline-success" : "btn-danger"}`}
                disabled={s.expired}
                onClick={() => !s.expired && toggleSlot(s.time)}
                title={s.expired ? "Expired - cannot edit" : s.available ? "Click to mark busy" : "Click to mark available"}
              >
                {s.time} {s.expired ? "(Expired)" : s.available ? "" : "(Busy)"}
              </button>
            ))}
          </div>

          <button className="btn btn-primary mt-3" onClick={saveSchedule} disabled={saving}>
            {saving ? "Saving..." : "Save Schedule"}
          </button>
        </>
      )}

      {/* Weekly Overview */}
      {weeklySchedules.length > 0 && (
        <div className="mt-4">
          <h6 className="fw-bold mb-2 text-secondary">Weekly Overview</h6>
          <div className="table-responsive">
            <table className="table table-bordered align-middle text-center">
              <thead className="table-light">
                <tr>
                  {weeklySchedules.map((d) => (
                    <th key={d.date}>
                      {new Date(d.date).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "2-digit" })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {defaultSlots.map((slot) => (
                  <tr key={slot.time}>
                    {weeklySchedules.map((d) => {
                      const found = d.slots.find((s) => s.time === slot.time) ?? { ...slot, available: true, expired: false };
                      const booked = isSlotBooked(d.date, slot.time);
                      const available = found.available && !booked && !found.expired;
                      return (
                        <td key={d.date + slot.time} className={available ? "text-success fw-semibold" : "text-danger fw-semibold"}>
                          {slot.time}
                          <br />
                          {available ? "✓ Available" : "× Busy"}
                          {booked && <div className="small text-muted">(Booked)</div>}
                          {found.expired && <div className="small text-muted">(Expired)</div>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerScheduleManager;
