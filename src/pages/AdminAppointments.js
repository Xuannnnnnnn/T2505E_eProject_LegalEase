import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import AppointmentsTable from "../components/AppointmentsTable";

const BASE_URL = "http://localhost:3001";

const AdminAppointments = () => {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";

  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState(initialStatus.toLowerCase());
  const [lawyerFilter, setLawyerFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // 🔹 Khi mount component → set mặc định tháng hiện tại
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setDateFrom(firstDay.toISOString().slice(0, 10));
    setDateTo(lastDay.toISOString().slice(0, 10));
  }, []);

  // 🔹 Load data
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const [resAppointments, resLawyers, resCustomers] = await Promise.all([
          fetch(`${BASE_URL}/appointments`),
          fetch(`${BASE_URL}/lawyers`),
          fetch(`${BASE_URL}/customers`),
        ]);

        const allAppointments = await resAppointments.json();
        const allLawyers = await resLawyers.json();
        const allCustomers = await resCustomers.json();

        const mapped = allAppointments.map((a) => {
          const lawyer = allLawyers.find((l) => l.id === a.lawyer_id);
          const customer = allCustomers.find((c) => c.id === a.customer_id);
          return {
            ...a,
            lawyer_name: lawyer ? lawyer.name : "Unknown Lawyer",
            customer_name: customer ? customer.fullname : "Unknown Customer",
          };
        });

        setAppointments(mapped);
        setFiltered(mapped);
      } catch (err) {
        console.error("Error loading appointments:", err);
      }
    };

    fetchAppointments();
  }, []);

  // 🔹 Filter khi các giá trị filter thay đổi
  useEffect(() => {
    let result = appointments;

    if (statusFilter !== "all") {
      result = result.filter(
        (a) => a.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (lawyerFilter !== "all") {
      result = result.filter((a) => a.lawyer_name === lawyerFilter);
    }

    if (customerFilter !== "all") {
      result = result.filter((a) => a.customer_name === customerFilter);
    }

    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter((a) => new Date(a.appointment_date) >= from);
    }

    if (dateTo) {
      const to = new Date(dateTo);
      result = result.filter((a) => new Date(a.appointment_date) <= to);
    }

    // 🔹 Sắp xếp: pending lên đầu → theo ngày gần nhất → approved/completed/rejected
    result.sort((a, b) => {
      const statusOrder = { pending: 1, approved: 2, completed: 3, rejected: 4 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return new Date(a.appointment_date) - new Date(b.appointment_date);
    });

    setFiltered(result);
  }, [statusFilter, lawyerFilter, customerFilter, dateFrom, dateTo, appointments]);

  // 🔹 Quick filters
  const setCurrentWeek = () => {
    const today = new Date();
    const first = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday
    const last = new Date(today.setDate(first.getDate() + 6)); // Sunday
    setDateFrom(first.toISOString().slice(0, 10));
    setDateTo(last.toISOString().slice(0, 10));
  };

  const setCurrentMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setDateFrom(firstDay.toISOString().slice(0, 10));
    setDateTo(lastDay.toISOString().slice(0, 10));
  };

  const setCurrentYear = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), 0, 1);
    const lastDay = new Date(now.getFullYear(), 11, 31);
    setDateFrom(firstDay.toISOString().slice(0, 10));
    setDateTo(lastDay.toISOString().slice(0, 10));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this appointment?")) {
      try {
        await fetch(`${BASE_URL}/appointments/${id}`, { method: "DELETE" });
        const updated = appointments.filter((a) => a.id !== id);
        setAppointments(updated);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${BASE_URL}/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = appointments.map((a) =>
          a.id === id ? { ...a, status: newStatus } : a
        );
        setAppointments(updated);
      }
    } catch (err) {
      console.error("Update status failed:", err);
    }
  };

  const lawyerList = [...new Set(appointments.map((a) => a.lawyer_name))];
  const customerList = [...new Set(appointments.map((a) => a.customer_name))];

  return (
    <div className="container my-0">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold text-primary">Admin – Manage Appointments</h4>
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            setStatusFilter(initialStatus.toLowerCase());
            setLawyerFilter("all");
            setCustomerFilter("all");
            setCurrentMonth(); // reset về tháng hiện tại
            setFiltered(appointments);
          }}
        >
          <i className="bi bi-arrow-counterclockwise me-2"></i> Reset
        </button>
      </div>

      {/* Quick filters */}
      <div className="mb-3">
        <Button variant="outline-primary" className="me-2" onClick={setCurrentWeek}>
          This Week
        </Button>
        <Button variant="outline-primary" className="me-2" onClick={setCurrentMonth}>
          This Month
        </Button>
        <Button variant="outline-primary" className="me-2" onClick={setCurrentYear}>
          This Year
        </Button>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-2 mb-2">
          <label className="form-label fw-semibold">Status:</label>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="col-md-2 mb-2">
          <label className="form-label fw-semibold">Lawyer:</label>
          <select
            className="form-select"
            value={lawyerFilter}
            onChange={(e) => setLawyerFilter(e.target.value)}
          >
            <option value="all">All</option>
            {lawyerList.map((lawyer, idx) => (
              <option key={idx} value={lawyer}>{lawyer}</option>
            ))}
          </select>
        </div>

        <div className="col-md-2 mb-2">
          <label className="form-label fw-semibold">Customer:</label>
          <select
            className="form-select"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
          >
            <option value="all">All</option>
            {customerList.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="col-md-3 mb-2">
          <label className="form-label fw-semibold">From Date:</label>
          <input
            type="date"
            className="form-control"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div className="col-md-3 mb-2">
          <label className="form-label fw-semibold">To Date:</label>
          <input
            type="date"
            className="form-control"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <AppointmentsTable
        appointments={filtered}
        role="admin"
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onView={(a) => setSelectedAppointment(a)}
      />

      {/* Modal */}
      {selectedAppointment && (
        <Modal show={true} onHide={() => setSelectedAppointment(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Appointment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Lawyer:</strong> {selectedAppointment.lawyer_name}</p>
            <p><strong>Customer:</strong> {selectedAppointment.customer_name}</p>
            <p><strong>Date:</strong> {selectedAppointment.appointment_date}</p>
            <p><strong>Time:</strong> {selectedAppointment.appointment_time}</p>
            <p><strong>Duration:</strong> {selectedAppointment.slot_duration} min</p>
            <p><strong>Total:</strong> ${selectedAppointment.total_price.toFixed(2)}</p>
            <p><strong>Status:</strong> {selectedAppointment.status}</p>
            <p><strong>Notes:</strong> {selectedAppointment.notes || "-"}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedAppointment(null)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default AdminAppointments;
