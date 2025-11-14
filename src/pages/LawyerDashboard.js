import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarLawyer from "../components/SidebarLawyer";
import LawyerScheduleManager from "../components/LawyerScheduleManager";
import AppointmentsTable from "../components/AppointmentsTable";
import { Button, Pagination } from "react-bootstrap";
import LawyerProfilePage from "../pages/LawyerProfilePage";
import { FaUserTie, FaCalendarAlt, FaStickyNote } from "react-icons/fa";
import LawyerAppointmentsReport from "../pages/LawyerAppointmentsReport";

const API_BASE = "http://localhost:3001";

// Hàm tiện ích: Lấy tuần hiện tại
const getCurrentWeekRange = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const format = (date) => date.toISOString().split("T")[0];
  return { start: format(startOfWeek), end: format(endOfWeek) };
};

// Hàm tiện ích: Sắp xếp appointments
const sortLawyerAppointments = (appts) => {
  const statusOrder = { pending: 1, approved: 2, completed: 3, rejected: 4 };
  return [...appts].sort((a, b) => {
    const orderA = statusOrder[a.status?.toLowerCase()] || 5;
    const orderB = statusOrder[b.status?.toLowerCase()] || 5;
    if (orderA !== orderB) return orderA - orderB;

    const dateA = new Date(
      (a.appointment_date || "1970-01-01") + " " + (a.appointment_time || "00:00")
    );
    const dateB = new Date(
      (b.appointment_date || "1970-01-01") + " " + (b.appointment_time || "00:00")
    );
    return dateB.getTime() - dateA.getTime();
  });
};

const LawyerDashboard = () => {
  const navigate = useNavigate();

  const [loggedLawyer, setLoggedLawyer] = useState(null);
  const [activeTab, setActiveTab] = useState("schedule");
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [viewingAppointment, setViewingAppointment] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null); // info khách hàng

  // Filters
  const [customerFilter, setCustomerFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Kiểm tra login
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const role = localStorage.getItem("userRole");

    if (!storedUser || role !== "lawyer") {
      navigate("/login");
      return;
    }
    setLoggedLawyer(storedUser);
  }, [navigate]);

  // Load appointments
  useEffect(() => {
    if (!loggedLawyer || activeTab !== "appointments") return;

    setLoadingAppointments(true);
    const lawyerId = loggedLawyer.id || loggedLawyer.lawyer_id;

    fetch(`${API_BASE}/appointments?lawyer_id=${lawyerId}`)
      .then((res) => res.json())
      .then((data) => {
        const sortedData = sortLawyerAppointments(data);
        setAppointments(sortedData);

        const weekRange = getCurrentWeekRange();
        setFromDate(weekRange.start);
        setToDate(weekRange.end);

        setLoadingAppointments(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingAppointments(false);
      });
  }, [loggedLawyer, activeTab]);

  // Cập nhật trạng thái appointment
  const updateAppointmentStatus = async (appointment, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      const updated = await res.json();

      setAppointments((prev) =>
        sortLawyerAppointments(
          prev.map((item) => (item.id === updated.id ? updated : item))
        )
      );

      if (viewingAppointment && viewingAppointment.id === updated.id) {
        setViewingAppointment(updated);
      }

      alert(`✅ Appointment status updated to ${newStatus.toUpperCase()}!`);
    } catch (err) {
      console.error(err);
      alert("Failed to update appointment status");
    }
  };

  const handleApprove = (a) => updateAppointmentStatus(a, "approved");
  const handleReject = (a) => updateAppointmentStatus(a, "rejected");
  const handleComplete = (a) => updateAppointmentStatus(a, "completed");

  // Xem chi tiết appointment và fetch info khách
  const handleView = async (appointment) => {
    setViewingAppointment(appointment);

    if (appointment.customer_id) {
      try {
        const res = await fetch(`${API_BASE}/customers/${appointment.customer_id}`);
        const data = await res.json();
        setCustomerInfo(data);
      } catch (err) {
        console.error(err);
        setCustomerInfo(null);
      }
    } else {
      setCustomerInfo(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  // Lọc appointments
  const getFilteredAppointments = () => {
    let filtered = [...appointments];

    if (customerFilter) {
      filtered = filtered.filter((a) =>
        (a.customer_name || "").toLowerCase().includes(customerFilter.toLowerCase())
      );
    }
    if (fromDate) {
      filtered = filtered.filter(
        (a) => new Date(a.appointment_date) >= new Date(fromDate)
      );
    }
    if (toDate) {
      filtered = filtered.filter(
        (a) => new Date(a.appointment_date) <= new Date(toDate)
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(
        (a) => (a.status || "").toLowerCase() === statusFilter.toLowerCase()
      );
    }
    return filtered;
  };

  const filteredAppointments = getFilteredAppointments();

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointmentsOnPage = filteredAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (!loggedLawyer) {
    return (
      <div className="text-center mt-5 text-secondary">
        Loading dashboard... (Checking authentication)
      </div>
    );
  }

  return (
    <div className="d-flex vh-100">
      <SidebarLawyer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="flex-grow-1 p-4 overflow-auto">

        {/* Schedule Tab */}
        {activeTab === "schedule" && (
          <LawyerScheduleManager
            lawyerId={loggedLawyer.id || loggedLawyer.lawyer_id}
          />
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div>
            <h5 className="mb-3 text-primary fw-bold">Manage Appointments</h5>

            {/* Filters */}
            <div className="mb-3 d-flex flex-wrap gap-2 align-items-end">
              <input
                type="text"
                placeholder="Search by customer name"
                className="form-control"
                style={{ width: "200px" }}
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
              />
              <div>
                <label>From: </label>
                <input
                  type="date"
                  className="form-control"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div>
                <label>To: </label>
                <input
                  type="date"
                  className="form-control"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <select
                className="form-select"
                style={{ width: "150px" }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setCustomerFilter("");
                  const weekRange = getCurrentWeekRange();
                  setFromDate(weekRange.start);
                  setToDate(weekRange.end);
                  setStatusFilter("");
                }}
              >
                Clear
              </button>
            </div>

            {loadingAppointments ? (
              <div>Loading appointments...</div>
            ) : (
              <>
                {/* Tổng tiền tất cả appointments đã lọc */}
                <div className="mb-3">
                  <h6>
                    Total Revenue: <strong>
                      ${filteredAppointments.reduce((sum, appt) => sum + (parseFloat(appt.total_price) || 0), 0).toFixed(2)}
                    </strong>
                  </h6>
                </div>

                {/* Bảng appointments */}
                <AppointmentsTable
                  appointments={currentAppointmentsOnPage}
                  role="lawyer"
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onComplete={handleComplete}
                  onView={handleView}
                />

                {/* Pagination */}
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    <Pagination.First
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages).keys()].map((number) => (
                      <Pagination.Item
                        key={number + 1}
                        active={number + 1 === currentPage}
                        onClick={() => handlePageChange(number + 1)}
                      >
                        {number + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              </>
            )}


            {/* Modal View Appointment */}
            {viewingAppointment && (
              <div
                className="modal fade show"
                style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content border-0 rounded-4">
                    <div className="modal-header bg-primary text-white">
                      <h5>Appointment Details</h5>
                      <button
                        className="btn-close btn-close-white"
                        onClick={() => setViewingAppointment(null)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      {/* Customer Information */}
                      <h5 className="mb-2 text-primary">
                        <FaUserTie className="me-2" />
                        Customer Information
                      </h5>
                      <div className="border rounded p-3 mb-4 bg-light">
                        <p className="mb-1"><strong>Name:</strong> {customerInfo?.fullname || viewingAppointment.customer_name || "-"}</p>
                        <p className="mb-1"><strong>Email:</strong> {customerInfo?.email || "N/A"}</p>
                        <p className="mb-1"><strong>Phone:</strong> {customerInfo?.phone || "N/A"}</p>
                      </div>

                      {/* Appointment & Status */}
                      <h5 className="mb-2 text-primary">
                        <FaCalendarAlt className="me-2" />
                        Appointment & Status
                      </h5>
                      <div className="border rounded p-3 mb-4">
                        <p className="mb-1">
                          <strong>Date & Time:</strong> {viewingAppointment.appointment_date || "-"} @ {viewingAppointment.appointment_time || "-"}
                        </p>
                        <p className="mb-1">
                          <strong>Duration:</strong> {viewingAppointment.slot_duration || 0} min
                        </p>
                        <p className="mb-1">
                          <strong>Status:</strong>{" "}
                          <span
                            className={`fw-bold text-${viewingAppointment.status === 'approved'
                              ? 'success'
                              : viewingAppointment.status === 'pending'
                                ? 'warning'
                                : viewingAppointment.status === 'completed'
                                  ? 'primary'
                                  : 'danger'
                              }`}
                          >
                            {viewingAppointment.status?.toUpperCase() || "PENDING"}
                          </span>
                        </p>
                        <p className="mb-1">
                          <strong>Price:</strong> ${viewingAppointment.total_price || '0.00'}
                        </p>
                      </div>

                      {/* Customer Notes */}
                      <h5 className="mb-2 text-primary">
                        <FaStickyNote className="me-2" />
                        Customer Message
                      </h5>
                      <div className="alert alert-secondary p-3 mb-0">
                        {viewingAppointment.notes || "No message provided."}
                      </div>

                      {/* Action Buttons */}
                      {(viewingAppointment.status === "pending" || viewingAppointment.status === "approved") && (
                        <div className="mt-4 d-flex gap-2">
                          {viewingAppointment.status === "pending" && (
                            <>
                              <Button variant="success" onClick={() => handleApprove(viewingAppointment)}>Approve</Button>
                              <Button variant="danger" onClick={() => handleReject(viewingAppointment)}>Reject</Button>
                            </>
                          )}
                          {viewingAppointment.status === "approved" && (
                            <Button variant="primary" className="w-100" onClick={() => handleComplete(viewingAppointment)}>
                              Mark as Completed
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="modal-footer">
                      <button
                        className="btn btn-secondary"
                        onClick={() => setViewingAppointment(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div>
            <h5 className="text-primary fw-bold">My Profile</h5>
            <LawyerProfilePage />
          </div>
        )}
        {/* Report Tab */}
        {activeTab === "reports" && (
          <div>
            <h5 className="text-primary fw-bold">My Appointments Report</h5>
            <LawyerAppointmentsReport />
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyerDashboard;
