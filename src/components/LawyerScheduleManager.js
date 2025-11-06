import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:3001";

const LawyerScheduleManager = ({ lawyerId }) => {
  const defaultSlots = [
    { time: "09:00", available: true },
    { time: "11:00", available: true },
    { time: "14:00", available: true },
    { time: "16:00", available: true },
  ];

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0] // ✅ mặc định hôm nay
  );
  const [slots, setSlots] = useState(defaultSlots);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [weeklySchedules, setWeeklySchedules] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // ✅ Helper: lấy ngày đầu tuần (Thứ Hai)
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 = Chủ nhật
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  // ✅ Lấy toàn bộ lịch hẹn đã đặt của luật sư
  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE}/appointments?lawyer_id=${lawyerId}`);
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Error loading appointments:", err);
    }
  };

  // ✅ Lấy lịch ngày được chọn
  const fetchScheduleForDate = async (date) => {
    if (!lawyerId || !date) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/schedules?lawyer_id=${lawyerId}&date=${date}`
      );
      const data = await res.json();
      if (data.length > 0) setSlots(data[0].slots);
      else setSlots(defaultSlots);
    } catch (err) {
      console.error("Error loading schedule:", err);
      setSlots(defaultSlots);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Lấy lịch của cả tuần (tuần chứa selectedDate)
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
        return {
          date: day,
          slots: found ? found.slots : defaultSlots,
        };
      });
      setWeeklySchedules(week);
    } catch (err) {
      console.error("Error loading weekly schedules:", err);
    }
  };

  // ✅ Khi load trang hoặc đổi ngày
  useEffect(() => {
    fetchScheduleForDate(selectedDate);
    fetchWeeklySchedules(selectedDate);
    fetchAppointments(); // lấy dữ liệu appointments
  }, [selectedDate, lawyerId]);

  // ✅ Chuyển trạng thái slot
  const toggleSlot = (time) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.time === time ? { ...slot, available: !slot.available } : slot
      )
    );
  };

  // ✅ Lưu lịch
  const saveSchedule = async () => {
    if (!selectedDate) {
      alert("Please select a date first.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        `${API_BASE}/schedules?lawyer_id=${lawyerId}&date=${selectedDate}`
      );
      const data = await res.json();

      if (data.length > 0) {
        await fetch(`${API_BASE}/schedules/${data[0].id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slots }),
        });
      } else {
        await fetch(`${API_BASE}/schedules`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lawyer_id: lawyerId,
            date: selectedDate,
            slots,
          }),
        });
      }

      alert("✅ Schedule saved successfully!");
      fetchWeeklySchedules(selectedDate); // cập nhật lại bảng tuần
      fetchAppointments(); // cập nhật trạng thái bận nếu có khách đặt
    } catch (err) {
      console.error("Error saving schedule:", err);
      alert("❌ Failed to save schedule. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Kiểm tra xem slot có bị khách đặt không
  const isSlotBooked = (date, time) => {
    return appointments.some(
      (a) =>
        a.lawyer_id === lawyerId &&
        a.appointment_date === date &&
        a.appointment_time === time &&
        a.status !== "cancelled"
    );
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
            {slots.map((slot) => (
              <button
                key={slot.time}
                type="button"
                className={`btn ${
                  slot.available ? "btn-outline-success" : "btn-danger"
                }`}
                onClick={() => toggleSlot(slot.time)}
              >
                {slot.time} {slot.available ? "" : "(Busy)"}
              </button>
            ))}
          </div>

          <button
            className="btn btn-primary mt-3"
            onClick={saveSchedule}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Schedule"}
          </button>
        </>
      )}

      {/* ✅ Hiển thị bảng lịch tuần */}
      {weeklySchedules.length > 0 && (
        <div className="mt-4">
          <h6 className="fw-bold mb-2 text-secondary">Weekly Overview</h6>
          <div className="table-responsive">
            <table className="table table-bordered align-middle text-center">
              <thead className="table-light">
                <tr>
                  {weeklySchedules.map((day) => (
                    <th key={day.date}>
                      {new Date(day.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {defaultSlots.map((slot) => (
                  <tr key={slot.time}>
                    {weeklySchedules.map((day) => {
                      const found = day.slots.find(
                        (s) => s.time === slot.time
                      );
                      const booked = isSlotBooked(day.date, slot.time);

                      // Nếu slot đã được khách đặt → ưu tiên hiển thị "Busy"
                      const available =
                        found?.available && !booked ? true : false;

                      return (
                        <td
                          key={day.date + slot.time}
                          className={
                            available
                              ? "text-success fw-semibold"
                              : "text-danger fw-semibold"
                          }
                        >
                          {slot.time}
                          <br />
                          {available ? "✓ Available" : "× Busy"}
                          {booked && (
                            <div className="small text-muted">(Booked)</div>
                          )}
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
