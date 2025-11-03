import React, { useEffect, useState } from "react";
import AppointmentsTable from "../components/AppointmentsTable";

const BASE_URL = "http://localhost:3001";

const LawyerAppointments = ({ lawyerId }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!lawyerId) return;

    const fetchData = async () => {
      try {
        // 🟢 Lấy danh sách appointments
        const resApp = await fetch(`${BASE_URL}/appointments`);
        const appointmentsData = await resApp.json();

        // 🟢 Lấy danh sách customers để map tên
        const resCus = await fetch(`${BASE_URL}/customers`);
        const customersData = await resCus.json();

        // 🟢 Lọc ra những cuộc hẹn của luật sư hiện tại
        const filtered = appointmentsData
          .filter((a) => Number(a.lawyer_id) === Number(lawyerId))
          .map((a) => {
            const customer = customersData.find(
              (c) => Number(c.id) === Number(a.customer_id)
            );
            return {
              ...a,
              customer_name: customer
                ? customer.name
                : `Customer #${a.customer_id}`,
            };
          });

        setAppointments(filtered);
      } catch (error) {
        console.error("Error loading appointments:", error);
      }
    };

    fetchData();
  }, [lawyerId]);

  // 🟢 Hàm cập nhật trạng thái
  const updateStatus = async (appointment, newStatus) => {
    try {
      await fetch(`${BASE_URL}/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      // cập nhật lại trong state
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointment.id ? { ...a, status: newStatus } : a
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
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
