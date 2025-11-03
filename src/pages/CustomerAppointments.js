import React, { useEffect, useState } from "react";
import AppointmentsTable from "../components/AppointmentsTable";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CustomerAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://localhost:3001"; // ⚙️ JSON Server

  // ✅ Lấy ID hoặc email của người dùng đăng nhập
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${BASE_URL}/appointments`);
        const data = await res.json();

        // ✅ Nếu có người dùng đăng nhập, chỉ lấy các lịch hẹn của người đó
        const userAppointments = user
          ? data.filter((a) => a.customer_email === user.email) // hoặc a.customer_id === user.id
          : data;

        setAppointments(userAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  return (
    <>
      <Header />
      <div className="container my-5">
        <h4 className="mb-3 fw-bold text-primary">My Appointments</h4>

        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length > 0 ? (
          <AppointmentsTable appointments={appointments} role="customer" />
        ) : (
          <p className="text-muted">You have no appointments yet.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CustomerAppointments;
