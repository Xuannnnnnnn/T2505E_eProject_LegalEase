// src/components/WeeklyOverview.jsx
import React, { useEffect, useState } from "react";
const API_BASE = "http://localhost:3001";

const defaultSlots = [
  { time: "09:00", available: true },
  { time: "11:00", available: true },
  { time: "14:00", available: true },
  { time: "16:00", available: true },
];

// small helper to mark expired & merge bookings
const markExpiredAndMerge = (date, slots, appointments = []) => {
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date();
  return slots
    .map((slot) => {
      const slotTime = new Date(`${date}T${slot.time}:00`);
      const dateOnly = new Date(`${date}T00:00:00`);
      const todayOnly = new Date(`${today}T00:00:00`);

      let expired = false;
      if (dateOnly < todayOnly) expired = true;
      if (date === today && slotTime < now) expired = true;

      const booked = appointments.some((a) => a.appointment_date === date && a.appointment_time === slot.time && a.status !== "cancelled");

      return { time: slot.time, available: slot.available && !booked && !expired, booked, expired };
    })
    .sort((a, b) => a.time.localeCompare(b.time));
};

const WeeklyOverview = ({ lawyerId, baseDate }) => {
  const [weekData, setWeekData] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!lawyerId) return;
    const load = async () => {
      try {
        const apptRes = await fetch(`${API_BASE}/appointments?lawyer_id=${lawyerId}`);
        const appts = await apptRes.json();
        setAppointments(appts || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [lawyerId]);

  useEffect(() => {
    if (!lawyerId || !baseDate) return;
    const getStartOfWeek = (date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(d.setDate(diff));
    };
    const loadWeek = async () => {
      try {
        const start = getStartOfWeek(baseDate);
        const days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          return d.toISOString().split("T")[0];
        });

        const res = await fetch(`${API_BASE}/schedules?lawyer_id=${lawyerId}`);
        const all = await res.json();

        const week = await Promise.all(
          days.map(async (day) => {
            const found = all.find((s) => s.date === day);
            const raw = found ? found.slots : defaultSlots;
            const merged = markExpiredAndMerge(day, raw, appointments);
            return { date: day, slots: merged };
          })
        );
        setWeekData(week);
      } catch (err) {
        console.error("WeeklyOverview load err:", err);
      }
    };
    loadWeek();
  }, [lawyerId, baseDate, appointments.length]);

  if (!weekData.length) return null;

  return (
    <div className="table-responsive mt-3">
      <table className="table table-bordered text-center">
        <thead className="table-light">
          <tr>
            {weekData.map((d) => (
              <th key={d.date}>
                {new Date(d.date).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "2-digit" })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {defaultSlots.map((slot) => (
            <tr key={slot.time}>
              {weekData.map((d) => {
                const s = d.slots.find((ss) => ss.time === slot.time) ?? { ...slot, available: true, booked: false, expired: false };
                const available = s.available && !s.booked && !s.expired;
                return (
                  <td key={d.date + slot.time} className={available ? "text-success fw-semibold" : "text-danger fw-semibold"}>
                    {slot.time}
                    <br />
                    {available ? "✓ Available" : "× Busy"}
                    {s.booked && <div className="small text-muted">(Booked)</div>}
                    {s.expired && <div className="small text-muted">(Expired)</div>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyOverview;
