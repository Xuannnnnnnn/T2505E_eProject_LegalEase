import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin");

  // Nếu chưa đăng nhập admin -> quay lại trang login
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
