import React, { useState, useEffect } from "react";
import SidebarCustomer from "../components/SidebarCustomer"; // Tương tự SidebarLawyer nhưng cho Customer
import AppointmentsTable from "../components/AppointmentsTable";

const CustomerDashboard = () => {
  const loggedCustomer = JSON.parse(localStorage.getItem("loggedInUser"));
  const [activeTab, setActiveTab] = useState("appointments"); // Tab mặc định: Appointments
  const [appointments, setAppointments] = useState([]);

  // Lấy danh sách cuộc hẹn của khách hàng
  useEffect(() => {
    const storedAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const myAppointments = storedAppointments.filter(
      (a) => a.customer_id === loggedCustomer.customer_id
    );
    setAppointments(myAppointments);
  }, [loggedCustomer]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/";
  };

  return (
    <div className="d-flex vh-100">
      <SidebarCustomer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="flex-grow-1 p-4 overflow-auto">
        <h3 className="mb-4 text-primary">Customer Dashboard</h3>

        <div className="mb-3">
          <button
            className={`btn me-2 ${activeTab === "appointments" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab("appointments")}
          >
            My Appointments
          </button>
          {/* Nếu muốn, có thể thêm tab khác như "Profile" */}
        </div>

        {activeTab === "appointments" && (
          <div>
            <h5>My Booked Appointments</h5>
            <AppointmentsTable
              appointments={appointments}
              role="customer"
              showDetails={true} // cho phép xem chi tiết cuộc hẹn
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
