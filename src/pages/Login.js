// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";

const BASE_URL = "http://localhost:3001";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Lấy redirect info (nếu đến từ booking)
  const navigateBack = location.state?.redirectBack;
  const appointmentForm = location.state?.appointmentForm;

  useEffect(() => {
    // Nếu pendingAppointment đã lưu trước đó, khởi tạo form lại
    const pending = JSON.parse(localStorage.getItem("pendingAppointment"));
    if (pending) {
      setRole("customer"); // mặc định booking là customer
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = role === "customer" ? "customers" : "lawyers";
      const res = await fetch(`${BASE_URL}/${endpoint}?email=${email}`);
      const data = await res.json();

      const user = data[0];
      if (!user || user.password_hash !== password) {
        setError("Incorrect email or password!");
        setLoading(false);
        return;
      }

      // ✅ Lưu thông tin người dùng
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      localStorage.setItem("userRole", role);

      // ✅ Nếu có redirect từ booking
      if (appointmentForm && navigateBack) {
        // Lưu tạm form để LawyerInformation mở modal
        localStorage.setItem("pendingAppointment", JSON.stringify(appointmentForm));
        navigate(navigateBack, { replace: true });
      } else {
        navigate("/"); // không có redirect → trang chủ
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to connect to server!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToRegister = () => {
    if (role === "customer") navigate("/registercustomer");
    else navigate("/registerlawyer");
  };

  return (
    <>
      <Header />
      <div className="container mt-5" style={{ maxWidth: "480px" }}>
        <h3 className="text-center mb-4 text-primary">Login to LegalEase</h3>

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Login as</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="customer">Customer</option>
              <option value="lawyer">Lawyer</option>
            </Form.Select>
          </Form.Group>

          {error && <div className="alert alert-danger">{error}</div>}

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? "Processing..." : "Login"}
          </Button>

          <div className="text-center mt-3">
            <span>Don't have an account? </span>
            <Button variant="link" onClick={handleGoToRegister}>
              Register
            </Button>
          </div>
        </Form>
      </div>
      <Footer />
    </>
  );
};

export default Login;
