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

  // Search filters
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ✅ Check login
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const role = localStorage.getItem("userRole");

    if (!storedUser || role !== "customer") {
      window.location.href = "/login";
      return;
    }
    setLoggedCustomer(storedUser);
  }, []);

  // ✅ Load appointments
  useEffect(() => {
    if (!loggedCustomer) return;

    const storedAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const myAppointments = storedAppointments.filter(
      (a) => a.customer_id === loggedCustomer.customer_id
    );
    setAppointments(myAppointments);
    setFilteredAppointments(myAppointments);
  }, [loggedCustomer]);

  // ✅ Load lawyers
  useEffect(() => {
    const storedLawyers = JSON.parse(localStorage.getItem("lawyers"));
    if (storedLawyers && storedLawyers.length > 0) {
      setLawyers(storedLawyers);
    } else {
      fetch("/data/lawyers.json")
        .then((res) => res.json())
        .then((data) => {
          setLawyers(data);
          localStorage.setItem("lawyers", JSON.stringify(data));
        })
        .catch((err) => console.error("Error loading lawyers.json:", err));
    }
  }, []);

  // ✅ Add new appointment
  const handleNewAppointment = (newAppointment) => {
    const updated = [...appointments, newAppointment];
    setAppointments(updated);
    setFilteredAppointments(updated);

    const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    allAppointments.push(newAppointment);
    localStorage.setItem("appointments", JSON.stringify(allAppointments));
  };

  // ✅ Filter search
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

        {activeTab === "profile" && (
          <div>
            <h5>Welcome, {loggedCustomer.name}</h5>
            <p>Email: {loggedCustomer.email}</p>
            <p>Phone: {loggedCustomer.phone}</p>
          </div>
        )}

        {activeTab === "appointments" && (
          <div>
            {/* 🔹 Booking Form First */}
            <h5>Book a New Appointment</h5>
            <div className="mb-3">
              <label className="form-label">Select Lawyer</label>
              <select
                className="form-select"
                value={selectedLawyer ? selectedLawyer.lawyer_id : ""}
                onChange={(e) => {
                  const id = parseInt(e.target.value);
                  const lawyer = lawyers.find((l) => l.lawyer_id === id);
                  setSelectedLawyer(lawyer);
                }}
              >
                <option value="">-- Choose a Lawyer --</option>
                {lawyers.map((l) => (
                  <option key={l.lawyer_id} value={l.lawyer_id}>
                    {l.name} - ${l.hourly_rate}/h
                  </option>
                ))}
              </select>
            </div>

            <AppointmentForm
              lawyer={selectedLawyer}
              customer={loggedCustomer}
              onNewAppointment={handleNewAppointment}
            />

            {/* 🔹 Search Section Below */}
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

            {/* 🔹 Appointment List */}
            <h5 className="mt-4">My Appointments</h5>
            <AppointmentsTable appointments={filteredAppointments} role="customer" />
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
