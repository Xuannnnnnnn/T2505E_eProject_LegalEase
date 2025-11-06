import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import AppointmentsTable from "../components/AppointmentsTable";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [lawyerFilter, setLawyerFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // 🔹 Load data from JSON-server
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const resAppointments = await fetch("http://localhost:3001/appointments");
        const allAppointments = await resAppointments.json();

        const resLawyers = await fetch("http://localhost:3001/lawyers");
        const allLawyers = await resLawyers.json();

        const mapped = allAppointments.map((a) => {
          const lawyer = allLawyers.find((l) => l.id === a.lawyer_id);
          return {
            ...a,
            lawyer_name: lawyer ? lawyer.name : "Unknown Lawyer",
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

  // 🔹 Filter when status/lawyer changes
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

    setFiltered(result);
  }, [statusFilter, lawyerFilter, appointments]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this appointment?")) {
      try {
        await fetch(`http://localhost:3001/appointments/${id}`, { method: "DELETE" });
        const updated = appointments.filter((a) => a.id !== id);
        setAppointments(updated);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:3001/appointments/${id}`, {
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

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold text-primary">Admin – Manage Appointments</h4>
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            setStatusFilter("all");
            setLawyerFilter("all");
            setFiltered(appointments);
          }}
        >
          <i className="bi bi-arrow-counterclockwise me-2"></i> Reset
        </button>
      </div>

      {/* Filter */}
      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <label className="form-label fw-semibold">Filter by Status:</label>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="col-md-6 mb-2">
          <label className="form-label fw-semibold">Filter by Lawyer:</label>
          <select
            className="form-select"
            value={lawyerFilter}
            onChange={(e) => setLawyerFilter(e.target.value)}
          >
            <option value="all">All</option>
            {lawyerList.map((lawyer, idx) => (
              <option key={idx} value={lawyer}>
                {lawyer}
              </option>
            ))}
          </select>
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

      {/* Modal: Appointment Details */}
      {selectedAppointment && (
        <Modal show={true} onHide={() => setSelectedAppointment(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Appointment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Lawyer:</strong> {selectedAppointment.lawyer_name}</p>
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
