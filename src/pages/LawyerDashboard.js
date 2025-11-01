import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarLawyer from "../components/SidebarLawyer";
import LawyerScheduleManager from "../components/LawyerScheduleManager";
import AppointmentsTable from "../components/AppointmentsTable";

const LawyerDashboard = () => {
  const navigate = useNavigate();

  const [loggedLawyer, setLoggedLawyer] = useState(null);
  const [activeTab, setActiveTab] = useState("schedule");
  const [appointments, setAppointments] = useState([]);

  // ✅ Kiểm tra login luật sư
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const role = localStorage.getItem("userRole");

    if (!storedUser || role !== "lawyer") {
      navigate("/login");
      return;
    }
    setLoggedLawyer(storedUser);
  }, [navigate]);

  // ✅ Load appointments của luật sư
  useEffect(() => {
    if (!loggedLawyer) return;

    const storedAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const myAppointments = storedAppointments.filter(
      (a) => a.lawyer_id === loggedLawyer.lawyer_id
    );
    setAppointments(myAppointments);
  }, [loggedLawyer]);

  // ✅ Update status appointment
  const updateAppointmentStatus = (a, status) => {
    const updated = appointments.map((item) =>
      item.lawyer_id === a.lawyer_id &&
      item.customer_id === a.customer_id &&
      item.appointment_date === a.appointment_date &&
      item.appointment_time === a.appointment_time
        ? { ...item, status }
        : item
    );
    setAppointments(updated);

    // Cập nhật toàn bộ appointments trong localStorage
    const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const merged = allAppointments.map((item) =>
      item.lawyer_id === a.lawyer_id &&
      item.customer_id === a.customer_id &&
      item.appointment_date === a.appointment_date &&
      item.appointment_time === a.appointment_time
        ? { ...item, status }
        : item
    );
    localStorage.setItem("appointments", JSON.stringify(merged));
  };

  const handleApprove = (a) => updateAppointmentStatus(a, "approved");
  const handleReject = (a) => updateAppointmentStatus(a, "rejected");

  // ✅ Logout SPA-friendly
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  if (!loggedLawyer) {
    return <div className="text-center mt-5 text-secondary">Loading dashboard...</div>;
  }

  return (
    <div className="d-flex vh-100">
      <SidebarLawyer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="flex-grow-1 p-4 overflow-auto">
        <h3 className="mb-4 text-primary">Lawyer Dashboard</h3>

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
              showDetails={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyerDashboard;
