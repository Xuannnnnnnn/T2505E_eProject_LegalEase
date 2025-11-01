import React, { useState, useEffect } from "react";
import SidebarCustomer from "../components/SidebarCustomer";
import AppointmentForm from "../components/AppointmentForm";
import AppointmentsTable from "../components/AppointmentsTable";
import FeedbackForm from "../components/FeedbackForm";

const CustomerDashboard = () => {
  const [loggedCustomer, setLoggedCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [appointments, setAppointments] = useState([]);

  // ✅ useEffect đầu tiên: kiểm tra đăng nhập
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const role = localStorage.getItem("userRole");

    if (!storedUser || role !== "customer") {
      window.location.href = "/login";
      return;
    }

    setLoggedCustomer(storedUser);
  }, []);

  // ✅ useEffect thứ hai: tải danh sách cuộc hẹn của customer
  useEffect(() => {
    if (!loggedCustomer) return;

    const storedAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const myAppointments = storedAppointments.filter(
      (a) => a.customer_id === loggedCustomer.customer_id
    );
    setAppointments(myAppointments);
  }, [loggedCustomer]);

  // ✅ Hàm đặt lịch mới
  const handleNewAppointment = (newAppointment) => {
    const updated = [...appointments, newAppointment];
    setAppointments(updated);

    // Cập nhật vào localStorage
    const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    allAppointments.push(newAppointment);
    localStorage.setItem("appointments", JSON.stringify(allAppointments));
  };

  // ✅ Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  // ✅ Khi chưa load xong dữ liệu
  if (!loggedCustomer) {
    return <div className="text-center mt-5 text-secondary">Loading dashboard...</div>;
  }

  return (
    <div className="d-flex vh-100">
      <SidebarCustomer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="flex-grow-1 p-4 overflow-auto">
        <h3 className="mb-4 text-primary">Customer Dashboard</h3>

        {activeTab === "profile" && (
          <div>
            <h5>Welcome, {loggedCustomer.name}</h5>
            <p>Email: {loggedCustomer.email}</p>
            <p>Phone: {loggedCustomer.phone}</p>
          </div>
        )}

        {activeTab === "appointments" && (
          <div>
            <h5>Book a New Appointment</h5>
            <AppointmentForm
              customer={loggedCustomer}
              onNewAppointment={handleNewAppointment}
            />

            <h5 className="mt-4">Your Appointments</h5>
            <AppointmentsTable appointments={appointments} role="customer" />
          </div>
        )}

        {activeTab === "feedback" && (
          <div>
            <h5>Share Your Feedback</h5>
            <FeedbackForm customerId={loggedCustomer.customer_id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
