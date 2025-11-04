import React from "react";

const AppointmentsTable = ({
  appointments = [],
  role,
  onApprove,
  onReject,
  onView,
}) => {
  if (!appointments.length) {
    return <div>No appointments found.</div>;
  }

  return (
    <table className="table table-striped table-bordered">
      <thead className="table-primary">
        <tr>
          <th>#</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Time</th>
          <th>Duration (min)</th>
          <th>Total Price</th>
          <th>Status</th>
          {role === "lawyer" && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {appointments.map((a, idx) => (
          <tr key={a.id}>
            <td>{idx + 1}</td>
            <td>{a.customer_name || `Customer #${a.customer_id}`}</td>
            <td>{a.appointment_date}</td>
            <td>{a.appointment_time}</td>
            <td>{a.slot_duration}</td>
            <td>${a.total_price?.toFixed(2)}</td>
            <td>{a.status}</td>
            {role === "lawyer" && (
              <td>
                <button
                  className="btn btn-sm btn-info me-2"
                  onClick={() => onView && onView(a)}
                >
                  View
                </button>
                {a.status === "pending" && (
                  <>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => onApprove && onApprove(a)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onReject && onReject(a)}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AppointmentsTable;
