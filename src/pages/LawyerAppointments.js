import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import AppointmentsTable from "../components/AppointmentsTable";

const BASE_URL = "http://localhost:3001";

const LawyerAppointments = ({ lawyerId }) => {
  const [allAppointments, setAllAppointments] = useState([]); // dữ liệu gốc
  const [appointments, setAppointments] = useState([]); // dữ liệu hiển thị
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔹 Bộ lọc
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // 🔹 Lấy danh sách appointments và map tên khách hàng
  useEffect(() => {
    if (!lawyerId) return;

    const fetchData = async () => {
      try {
        const resApp = await fetch(`${BASE_URL}/appointments`);
        const appointmentsData = await resApp.json();

        const resCus = await fetch(`${BASE_URL}/customers`);
        const customersData = await resCus.json();

        const filtered = appointmentsData
          .filter((a) => Number(a.lawyer_id) === Number(lawyerId))
          .map((a) => {
            const customer = customersData.find(
              (c) => Number(c.id) === Number(a.customer_id)
            );
            return {
              ...a,
              customer_name: customer
                ? customer.name
                : `Customer #${a.customer_id}`,
            };
          });

        setAllAppointments(filtered);
        setAppointments(filtered);
      } catch (error) {
        console.error("Error loading appointments:", error);
      }
    };

    fetchData();
  }, [lawyerId]);

  // 🔹 Tìm kiếm / lọc
  const handleSearch = () => {
    let filtered = [...allAppointments];

    if (statusFilter)
      filtered = filtered.filter((a) => a.status === statusFilter);

    if (fromDate)
      filtered = filtered.filter(
        (a) => new Date(a.appointment_date) >= new Date(fromDate)
      );

    if (toDate)
      filtered = filtered.filter(
        (a) => new Date(a.appointment_date) <= new Date(toDate)
      );

    setAppointments(filtered);
  };

  // 🔹 Reset bộ lọc
  const handleReset = () => {
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    setAppointments(allAppointments);
  };

  // 🔹 Cập nhật status
  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await fetch(`${BASE_URL}/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointmentId ? { ...a, status: newStatus } : a
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // 🔹 Xem chi tiết appointment
  const handleView = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  return (
    <div className="container my-5">
      <h4 className="mb-3 fw-bold text-primary">Your Appointments</h4>

      {/* 🔍 Bộ lọc tìm kiếm */}
      <div className="border rounded p-3 bg-light mb-4">
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
          <div className="col-md-3 d-flex align-items-end gap-2">
            <button className="btn btn-primary w-100" onClick={handleSearch}>
              Search
            </button>
            <button className="btn btn-secondary w-100" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Bảng hiển thị appointments */}
      <AppointmentsTable
        appointments={appointments}
        role="lawyer"
        onStatusChange={handleStatusChange}
        onView={handleView}
      />

      {/* 🔹 Modal chi tiết */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment ? (
            <div>
              <p>
                <strong>Customer:</strong> {selectedAppointment.customer_name}
              </p>
              <p>
                <strong>Date & Time:</strong>{" "}
                {selectedAppointment.appointment_date}{" "}
                {selectedAppointment.appointment_time}
              </p>
              <p>
                <strong>Duration:</strong> {selectedAppointment.slot_duration}{" "}
                min
              </p>
              <p>
                <strong>Total:</strong> $
                {selectedAppointment.total_price?.toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong> {selectedAppointment.status}
              </p>
              <p>
                <strong>Notes:</strong> {selectedAppointment.notes || "-"}
              </p>
            </div>
          ) : (
            <p>No appointment selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LawyerAppointments;
