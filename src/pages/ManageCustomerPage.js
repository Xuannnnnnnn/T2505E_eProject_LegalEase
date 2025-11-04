import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Modal, Spinner } from "react-bootstrap";

const BASE_URL = "http://localhost:3001";

const ManageCustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch customer data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/customers`);
        const data = await res.json();
        setCustomers(data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Approve customer
  const handleApprove = async (customer) => {
    const updated = { verify_status: true, status: "Approved" };
    await fetch(`${BASE_URL}/customers/${customer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setCustomers((prev) =>
      prev.map((c) => (c.id === customer.id ? { ...c, ...updated } : c))
    );
    alert("✅ Customer approved!");
  };

  // Reject customer
  const handleReject = async (customer) => {
    const updated = { verify_status: false, status: "Rejected" };
    await fetch(`${BASE_URL}/customers/${customer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setCustomers((prev) =>
      prev.map((c) => (c.id === customer.id ? { ...c, ...updated } : c))
    );
    alert("❌ Customer rejected!");
  };

  // Delete customer
  const handleDelete = async (customerId) => {
    if (!window.confirm("Bạn có chắc muốn xóa khách hàng này?")) return;
    await fetch(`${BASE_URL}/customers/${customerId}`, { method: "DELETE" });
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
  };

  // View customer details
  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h3 className="fw-bold mb-4 text-primary">📋 Manage Customers</h3>
      <Table bordered hover responsive className="bg-white shadow-sm">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, idx) => (
            <tr key={c.id}>
              <td>{idx + 1}</td>
              <td>{c.fullname}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>
                <Badge
                  bg={
                    c.status === "Approved"
                      ? "success"
                      : c.status === "Rejected"
                      ? "danger"
                      : "warning"
                  }
                >
                  {c.status || "Pending"}
                </Badge>
              </td>
              <td>
                <Button
                  size="sm"
                  variant="info"
                  className="me-2"
                  onClick={() => handleView(c)}
                >
                  View
                </Button>
                {c.status === "Pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="success"
                      className="me-2"
                      onClick={() => handleApprove(c)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleReject(c)}
                    >
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  className="ms-2"
                  onClick={() => handleDelete(c.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal chi tiết khách hàng */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer ? (
            <div>
              <p><strong>Full Name:</strong> {selectedCustomer.name}</p>
              <p><strong>Email:</strong> {selectedCustomer.email}</p>
              <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
              <p><strong>Address:</strong> {selectedCustomer.address || "-"}</p>
              <p><strong>Status:</strong> {selectedCustomer.status || "Pending"}</p>
              <p><strong>Verified:</strong> {selectedCustomer.verify_status ? "Yes" : "No"}</p>
            </div>
          ) : (
            <p>No customer selected.</p>
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

export default ManageCustomerPage;
