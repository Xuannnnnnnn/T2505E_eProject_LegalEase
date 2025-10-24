import React from "react";
import { Table, Button, Modal } from "react-bootstrap";

const AppointmentsTable = ({ appointments, role, onApprove, onReject, showDetails }) => {
  const [selectedAppointment, setSelectedAppointment] = React.useState(null);

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
          {appointments.length === 0 ? (
            <tr>
              <td colSpan={role === "lawyer" ? 8 : 7} className="text-center">
                No appointments
              </td>
            </tr>
          ) : (
            appointments.map((a, index) => (
              <tr key={index}>
                <td>{role === "lawyer" ? a.customer_name : a.lawyer_name}</td>
                <td>{a.appointment_date}</td>
                <td>{a.appointment_time}</td>
                <td>{a.slot_duration} min</td>
                <td>{a.total_price.toFixed(2)}</td>
                <td>{a.status}</td>
                {role === "lawyer" && (
                  <td>
                    {a.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="success"
                          className="me-2"
                          onClick={() => onApprove(a)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => onReject(a)}
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
            <p>
              <strong>Lawyer:</strong> {selectedAppointment.lawyer_name}
            </p>
            <p>
              <strong>Customer:</strong> {selectedAppointment.customer_name}
            </p>
            <p>
              <strong>Date:</strong> {selectedAppointment.appointment_date}
            </p>
            <p>
              <strong>Time:</strong> {selectedAppointment.appointment_time}
            </p>
            <p>
              <strong>Duration:</strong> {selectedAppointment.slot_duration} min
            </p>
            <p>
              <strong>Total:</strong> ${selectedAppointment.total_price.toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong> {selectedAppointment.status}
            </p>
            <p>
              <strong>Notes:</strong> {selectedAppointment.notes || "-"}
            </p>
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
