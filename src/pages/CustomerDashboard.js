import React, { useState, useEffect } from "react";
import SidebarCustomer from "../components/SidebarCustomer";
import AppointmentForm from "../components/AppointmentForm";
import AppointmentsTable from "../components/AppointmentsTable";
import FeedbackForm from "../components/FeedbackForm";

const CustomerDashboard = () => {
  const [loggedCustomer, setLoggedCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:3001"; // ⚙️ JSON Server

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ✅ Kiểm tra đăng nhập
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const role = localStorage.getItem("userRole");

    if (!storedUser || role !== "customer") {
      window.location.href = "/login";
      return;
    }
    setLoggedCustomer(storedUser);
  }, []);

  // ✅ Load danh sách luật sư từ db.json
  useEffect(() => {
    fetch(`${BASE_URL}/lawyers`)
      .then((res) => res.json())
      .then((data) => setLawyers(data.filter((l) => l.status === "Approved")))
      .catch((err) => console.error("Error loading lawyers:", err));
  }, []);

  // ✅ Load các cuộc hẹn của khách hàng từ db.json
  useEffect(() => {
    if (!loggedCustomer) return;

    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${BASE_URL}/appointments`);
        const data = await res.json();

        // lọc cuộc hẹn theo customer_id hoặc email
        const myAppointments = data.filter(
          (a) =>
            a.customer_id === loggedCustomer.id ||
            a.customer_email === loggedCustomer.email
        );

        setAppointments(myAppointments);
        setFilteredAppointments(myAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [loggedCustomer]);

  // ✅ Tạo mới cuộc hẹn (lưu vào JSON Server)
  const handleNewAppointment = async (newAppointment) => {
    try {
      const res = await fetch(`${BASE_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAppointment),
      });

      if (res.ok) {
        const created = await res.json();
        const updated = [...appointments, created];
        setAppointments(updated);
        setFilteredAppointments(updated);
      } else {
        console.error("Error saving appointment");
      }
    } catch (err) {
      console.error("Error creating appointment:", err);
    }
  };

  // ✅ Lọc theo trạng thái và thời gian
  const handleSearch = () => {
    let filtered = [...appointments];
    if (statusFilter) {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }
    if (fromDate) {
      filtered = filtered.filter((a) => a.appointment_date >= fromDate);
    }
    if (toDate) {
      filtered = filtered.filter((a) => a.appointment_date <= toDate);
    }
    setFilteredAppointments(filtered);
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

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

        {/* 🔹 Tab Profile */}
        {activeTab === "profile" && (
          <div>
            <h5>Welcome, {loggedCustomer.name}</h5>
            <p>Email: {loggedCustomer.email}</p>
            <p>Phone: {loggedCustomer.phone}</p>
          </div>
        )}

        {/* 🔹 Tab Appointments */}
        {activeTab === "appointments" && (
          <div>

            {/* Search */}
            <div className="mt-5 border rounded p-3 bg-light">
              <h5 className="mb-3">Search Appointments</h5>
              <div className="row g-3">
                <div className="col-md-3">
                  <label>Status</label>
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label>From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label>To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <button className="btn btn-primary w-100" onClick={handleSearch}>
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Appointment List */}
            <h5 className="mt-4">My Appointments</h5>
            {loading ? (
              <p>Loading appointments...</p>
            ) : (
              <AppointmentsTable appointments={filteredAppointments} role="customer" />
            )}
          </div>
        )}

        {/* 🔹 Tab Feedback */}
        {activeTab === "feedback" && (
          <div>
            <h5>Share Your Feedback</h5>
            <FeedbackForm customerId={loggedCustomer.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
