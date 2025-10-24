import React, { useEffect, useState } from "react";
import AppointmentsTable from "../components/AppointmentsTable";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CustomerAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("appointments")) || [];
    setAppointments(stored);
  }, []);

  return (
    <>
      <Header />
      <div className="container my-5">
        <h4 className="mb-3 fw-bold text-primary">My Appointments</h4>
        <AppointmentsTable appointments={appointments} role="customer" />
      </div>
      <Footer />
    </>
  );
};

export default CustomerAppointments;
