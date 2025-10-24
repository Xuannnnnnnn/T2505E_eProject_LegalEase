import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";

const slots = ["09:00", "11:00", "14:00", "16:00"];

const LawyerScheduleManager = ({ lawyerId }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [schedule, setSchedule] = useState({}); // { "2025-10-24": { "09:00": "available" } }

  // Load từ localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("lawyerSchedules")) || {};
    setSchedule(stored);
  }, []);

  // Toggle slot trống / bận
  const toggleSlot = (slot) => {
    const daySchedule = schedule[selectedDate] || {};
    const currentStatus = daySchedule[slot] || "available";
    const updatedStatus = currentStatus === "available" ? "busy" : "available";

    const updatedDay = { ...daySchedule, [slot]: updatedStatus };
    const updatedSchedule = { ...schedule, [selectedDate]: updatedDay };
    setSchedule(updatedSchedule);
    localStorage.setItem("lawyerSchedules", JSON.stringify(updatedSchedule));
  };

  const getSlotStatus = (slot) => {
    return schedule[selectedDate]?.[slot] || "available";
  };

  return (
    <div>
      <label>Select Date:</label>
      <input
        type="date"
        className="form-control mb-3"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Time Slot</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot) => (
            <tr key={slot}>
              <td>{slot}</td>
              <td>{getSlotStatus(slot)}</td>
              <td>
                <Button
                  size="sm"
                  variant={getSlotStatus(slot) === "available" ? "danger" : "success"}
                  onClick={() => toggleSlot(slot)}
                >
                  {getSlotStatus(slot) === "available" ? "Mark Busy" : "Mark Available"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default LawyerScheduleManager;
