import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import AppointmentsTable from "../components/AppointmentsTable";

const BASE_URL = "http://localhost:3001";

const LawyerAppointments = ({ lawyerId }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

        setAppointments(filtered);
      } catch (error) {
        console.error("Error loading appointments:", error);
      }
    };

    fetchData();
  }, [lawyerId]);

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

      <AppointmentsTable
        appointments={appointments}
        role="lawyer"
        onStatusChange={handleStatusChange}
        onView={handleView}
      />

      {/* Modal chi tiết */}
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
                <strong>Total:</strong> ${selectedAppointment.total_price?.toFixed(2)}
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
