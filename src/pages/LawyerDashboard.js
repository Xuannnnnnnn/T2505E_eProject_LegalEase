import React, { useState, useEffect } from "react";
import SidebarLawyer from "../components/SidebarLawyer";
import LawyerScheduleManager from "../components/LawyerScheduleManager";
import AppointmentsTable from "../components/AppointmentsTable";

const LawyerDashboard = () => {
  const loggedLawyer = JSON.parse(localStorage.getItem("loggedInUser"));
  const [activeTab, setActiveTab] = useState("schedule"); // "schedule" hoặc "appointments"
  const [appointments, setAppointments] = useState([]);

  // Load danh sách cuộc hẹn của luật sư
  useEffect(() => {
    const storedAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const myAppointments = storedAppointments.filter(
      (a) => a.lawyer_id === loggedLawyer.lawyer_id
    );
    setAppointments(myAppointments);
  }, [loggedLawyer]);

  // Đồng bộ approve/reject vào localStorage
  const updateAppointmentStatus = (a, status) => {
    const updatedAppointments = appointments.map(item =>
      item.customer_id === a.customer_id && item.appointment_time === a.appointment_time
        ? { ...item, status }
        : item
    );
    setAppointments(updatedAppointments);

    const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const merged = allAppointments.map(item =>
      item.customer_id === a.customer_id && item.appointment_time === a.appointment_time
        ? { ...item, status }
        : item
    );
    localStorage.setItem("appointments", JSON.stringify(merged));
  };

  const handleApprove = (a) => updateAppointmentStatus(a, "approved");
  const handleReject = (a) => updateAppointmentStatus(a, "rejected");

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/";
  };

  return (
    <div className="d-flex vh-100">
      <SidebarLawyer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="flex-grow-1 p-4 overflow-auto">
        <h3 className="mb-4 text-primary">My Dashboard</h3>

        <div className="mb-3">
          <button
            className={`btn me-2 ${activeTab === "schedule" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab("schedule")}
          >
            Manage Schedule
          </button>
          <button
            className={`btn ${activeTab === "appointments" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab("appointments")}
          >
            Appointments
          </button>
        </div>

        {activeTab === "schedule" && (
          <div>
            <h5>Configure your available slots</h5>
            <LawyerScheduleManager lawyerId={loggedLawyer.lawyer_id} />
          </div>
        )}

        {activeTab === "appointments" && (
          <div>
            <h5>Customer Appointments</h5>
            <AppointmentsTable
              appointments={appointments}
              role="lawyer"
              onApprove={handleApprove}
              onReject={handleReject}
              showDetails={true} // cho phép xem chi tiết cuộc hẹn
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyerDashboard;
