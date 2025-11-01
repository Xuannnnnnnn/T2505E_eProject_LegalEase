import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";

const AppointmentsTable = ({ appointments, role, onApprove, onReject, showDetails }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [fixedAppointments, setFixedAppointments] = useState([]);

  // ✅ Tự động kiểm tra và sửa dữ liệu cũ (nếu thiếu total_price)
  useEffect(() => {
    if (!appointments || appointments.length === 0) {
      setFixedAppointments([]);
      return;
    }

    const cleaned = appointments.map((a) => ({
      ...a,
      total_price: a.total_price ?? 0, // nếu chưa có thì gán 0
      slot_duration: a.slot_duration ?? 60, // mặc định 60 phút nếu thiếu
      appointment_date: a.appointment_date || "N/A",
      appointment_time: a.appointment_time || "N/A",
      lawyer_name: a.lawyer_name || "Unknown Lawyer",
      customer_name: a.customer_name || "Unknown Customer",
      status: a.status || "pending",
    }));

    setFixedAppointments(cleaned);
  }, [appointments]);

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Customer / Lawyer</th>
            <th>Date</th>
            <th>Time</th>
            <th>Duration</th>
            <th>Total ($)</th>
            <th>Status</th>
            {role === "lawyer" && <th>Actions</th>}
            {showDetails && <th>Details</th>}
          </tr>
        </thead>
        <tbody>
          {fixedAppointments.length === 0 ? (
            <tr>
              <td colSpan={role === "lawyer" ? 8 : 7} className="text-center">
                No appointments found
              </td>
            </tr>
          ) : (
            fixedAppointments.map((a, index) => (
              <tr key={index}>
                <td>{role === "lawyer" ? a.customer_name : a.lawyer_name}</td>
                <td>{a.appointment_date}</td>
                <td>{a.appointment_time}</td>
                <td>{a.slot_duration} min</td>
                <td>{a.total_price ? a.total_price.toFixed(2) : "0.00"}</td>
                <td>{a.status}</td>

                {role === "lawyer" && (
                  <td>
                    {a.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="success"
                          className="me-2"
                          onClick={() => onApprove && onApprove(a)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => onReject && onReject(a)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </td>
                )}

                {showDetails && (
                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => setSelectedAppointment(a)}
                    >
                      View
                    </Button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal hiển thị chi tiết */}
      {selectedAppointment && (
        <Modal
          show={true}
          onHide={() => setSelectedAppointment(null)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Appointment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Lawyer:</strong> {selectedAppointment.lawyer_name}</p>
            <p><strong>Customer:</strong> {selectedAppointment.customer_name}</p>
            <p><strong>Date:</strong> {selectedAppointment.appointment_date}</p>
            <p><strong>Time:</strong> {selectedAppointment.appointment_time}</p>
            <p><strong>Duration:</strong> {selectedAppointment.slot_duration} min</p>
            <p>
              <strong>Total:</strong> $
              {selectedAppointment.total_price
                ? selectedAppointment.total_price.toFixed(2)
                : "0.00"}
            </p>
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
    </>
  );
};

export default AppointmentsTable;
