import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:3001";

// Component hiển thị các slot lịch của luật sư
const CustomerSchedule = ({ lawyerId, selectedDate, onSelectSlot }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lawyerId || !selectedDate) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1️⃣ Lấy cấu hình lịch làm việc của luật sư
        const scheduleRes = await fetch(
          `${BASE_URL}/schedules?lawyer_id=${lawyerId}&date=${selectedDate}`
        );
        const scheduleData = await scheduleRes.json();

        // Nếu có dữ liệu lịch làm việc
        let configuredSlots = [];
        if (scheduleData.length > 0) {
          configuredSlots = scheduleData[0].slots; // [{time, available}]
        } else {
          // Nếu luật sư chưa cấu hình → mặc định tất cả slot khả dụng
          configuredSlots = [
            { time: "09:00", available: true },
            { time: "11:00", available: true },
            { time: "14:00", available: true },
            { time: "16:00", available: true },
          ];
        }

        // 2️⃣ Lấy danh sách các cuộc hẹn thực tế (đã có khách đặt)
        const appointmentRes = await fetch(
          `${BASE_URL}/appointments?lawyer_id=${lawyerId}&appointment_date=${selectedDate}`
        );
        const appointments = await appointmentRes.json();

        // 3️⃣ Kết hợp hai nguồn dữ liệu
        const updatedSlots = configuredSlots.map((slot) => {
          const isBooked = appointments.some(
            (a) => a.appointment_time === slot.time
          );
          return {
            ...slot,
            available: slot.available && !isBooked,
          };
        });

        setSlots(updatedSlots);
      } catch (err) {
        console.error("Error loading slots:", err);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lawyerId, selectedDate]);

  return (
    <div className="mb-3">
      <label>Select Time Slot:</label>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="d-flex flex-wrap gap-2 mt-2">
          {slots.map((slot) => (
            <button
              key={slot.time}
              type="button"
              className={`btn ${
                slot.available
                  ? "btn-outline-primary"
                  : "btn-secondary disabled"
              }`}
              onClick={() =>
                slot.available && onSelectSlot(slot.time, selectedDate)
              }
            >
              {slot.time} ({slot.available ? "available" : "busy"})
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


export default CustomerSchedule;
