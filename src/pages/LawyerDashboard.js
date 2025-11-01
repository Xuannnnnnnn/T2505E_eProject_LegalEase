import React, { useState, useEffect } from "react";
import SidebarLawyer from "../components/SidebarLawyer";
import LawyerScheduleManager from "../components/LawyerScheduleManager";
import AppointmentsTable from "../components/AppointmentsTable";

const LawyerDashboard = () => {
  const [loggedLawyer, setLoggedLawyer] = useState(null);
  const [activeTab, setActiveTab] = useState("schedule");
  const [appointments, setAppointments] = useState([]);

  // ✅ useEffect đầu tiên: kiểm tra login
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const role = localStorage.getItem("userRole");

    if (!storedUser || role !== "lawyer") {
      window.location.href = "/login";
      return;
    }

    setLoggedLawyer(storedUser);
  }, []);

  // ✅ useEffect thứ hai: chỉ chạy khi có loggedLawyer
  useEffect(() => {
    if (!loggedLawyer) return;

    const storedAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const myAppointments = storedAppointments.filter(
      (a) => a.lawyer_id === loggedLawyer.lawyer_id
    );
    setAppointments(myAppointments);
  }, [loggedLawyer]);

  const updateAppointmentStatus = (a, status) => {
    const updated = appointments.map((item) =>
      item.customer_id === a.customer_id && item.appointment_time === a.appointment_time
        ? { ...item, status }
        : item
    );
    setAppointments(updated);

    const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const merged = allAppointments.map((item) =>
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
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  // ✅ Khi chưa load xong dữ liệu
  if (!loggedLawyer) {
    return <div className="text-center mt-5 text-secondary">Loading dashboard...</div>;
  }

  return (
    <div className="d-flex vh-100">
      <SidebarLawyer activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <div className="flex-grow-1 p-4 overflow-auto">
        <h3 className="mb-4 text-primary">Lawyer Dashboard</h3>

        <div className="mb-3">
          <button
            className={`btn me-2 ${
              activeTab === "schedule" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setActiveTab("schedule")}
          >
            Manage Schedule
          </button>
          <button
            className={`btn ${
              activeTab === "appointments" ? "btn-primary" : "btn-outline-primary"
            }`}
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
              showDetails={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyerDashboard;
