import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Modal, Spinner } from "react-bootstrap";

const BASE_URL = "http://localhost:3001";

const ManageTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Lấy transactions
        const resTx = await fetch(`${BASE_URL}/transactions`);
        if (!resTx.ok) throw new Error("Failed to fetch transactions");
        const txData = await resTx.json();

        // 2️⃣ Lấy customers
        const resCus = await fetch(`${BASE_URL}/customers`);
        if (!resCus.ok) throw new Error("Failed to fetch customers");
        const customers = await resCus.json();

        // 3️⃣ Lấy lawyers
        const resLaw = await fetch(`${BASE_URL}/lawyers`);
        if (!resLaw.ok) throw new Error("Failed to fetch lawyers");
        const lawyers = await resLaw.json();

        // 4️⃣ Map customer_name và lawyer_name
        const mappedData = txData.map((t) => {
          const customer = customers.find((c) => Number(c.id) === Number(t.id));
          const lawyer = lawyers.find((l) => Number(l.id) === Number(t.id));
          return {
            ...t,
            customer_name: customer ? customer.name : "Unknown Customer",
            lawyer_name: lawyer ? lawyer.name : "Unknown Lawyer",
          };
        });

        setTransactions(mappedData);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (t, newStatus) => {
    try {
      const res = await fetch(`${BASE_URL}/transactions/${t.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      setTransactions((prev) =>
        prev.map((tx) => (tx.id === t.id ? { ...tx, status: newStatus } : tx))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update transaction status");
    }
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
      <h3 className="fw-bold mb-4 text-primary">💰 Manage Transactions</h3>
      <Table bordered hover responsive className="bg-white shadow-sm">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Customer</th>
            <th>Lawyer</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, idx) => (
            <tr key={t.id}>
              <td>{idx + 1}</td>
              <td>{t.customer_name}</td>
              <td>{t.lawyer_name}</td>
              <td>{new Date(t.date).toLocaleDateString()}</td>
              <td>${t.amount.toFixed(2)}</td>
              <td>
                <Badge
                  bg={
                    t.status === "Success"
                      ? "success"
                      : t.status === "Failed"
                      ? "danger"
                      : "warning"
                  }
                >
                  {t.status}
                </Badge>
              </td>
              <td>
                <select
                  className="form-select form-select-sm d-inline w-auto me-2"
                  value={t.status}
                  onChange={(e) => handleStatusChange(t, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Success">Success</option>
                  <option value="Failed">Failed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => {
                    setSelectedTransaction(t);
                    setShowModal(true);
                  }}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="md">
        <Modal.Header closeButton>
          <Modal.Title>Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction ? (
            <div>
              <p>
                <strong>Customer:</strong> {selectedTransaction.customer_name}
              </p>
              <p>
                <strong>Lawyer:</strong> {selectedTransaction.lawyer_name}
              </p>
              <p>
                <strong>Date:</strong> {new Date(selectedTransaction.date).toLocaleString()}
              </p>
              <p>
                <strong>Amount:</strong> ${selectedTransaction.amount.toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong> {selectedTransaction.status}
              </p>
              {selectedTransaction.notes && (
                <p>
                  <strong>Notes:</strong> {selectedTransaction.notes}
                </p>
              )}
            </div>
          ) : (
            <p>No transaction selected.</p>
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

export default ManageTransactionsPage;
