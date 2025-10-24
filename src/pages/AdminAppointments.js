import React, { useEffect, useState } from "react";
import AppointmentsTable from "../components/AppointmentsTable";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [lawyerFilter, setLawyerFilter] = useState("all");

  // ✅ Load dữ liệu từ localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("appointments")) || [];
    setAppointments(stored);
    setFiltered(stored);
  }, []);

  // ✅ Khi thay đổi filter thì cập nhật danh sách hiển thị
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

  const handleDelete = (id) => {
    if (window.confirm("Xóa lịch hẹn này?")) {
      const updated = appointments.filter((a) => a.id !== id);
      setAppointments(updated);
      localStorage.setItem("appointments", JSON.stringify(updated));
    }
  };

  // ✅ Lấy danh sách luật sư duy nhất
  const lawyerList = [...new Set(appointments.map((a) => a.lawyer_name))];

  return (
    <>
      
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold text-primary">Admin – Quản lý lịch hẹn</h4>
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setStatusFilter("all");
              setLawyerFilter("all");
              setFiltered(appointments);
            }}
          >
            <i className="bi bi-arrow-counterclockwise me-2"></i> Reset lọc
          </button>
        </div>

        {/* 🎯 Bộ lọc */}
        <div className="row mb-4">
          <div className="col-md-6 mb-2">
            <label className="form-label fw-semibold">Lọc theo trạng thái:</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="pending">Pending</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="col-md-6 mb-2">
            <label className="form-label fw-semibold">Lọc theo luật sư:</label>
            <select
              className="form-select"
              value={lawyerFilter}
              onChange={(e) => setLawyerFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              {lawyerList.map((lawyer, idx) => (
                <option key={idx} value={lawyer}>
                  {lawyer}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 🧾 Bảng hiển thị lịch hẹn */}
        <AppointmentsTable
          appointments={filtered}
          role="admin"
          onDelete={handleDelete}
        />
      </div>
      
    </>
  );
};

export default AdminAppointments;
