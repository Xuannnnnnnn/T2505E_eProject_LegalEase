// Login.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import lawyersData from "../data/lawyers.json";
import customersData from "../data/customers.json";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Khi mở trang login, nếu đã login thì chuyển hướng
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedUser) {
      if (loggedUser.role === "lawyer") navigate("/lawyer-dashboard");
      else if (loggedUser.role === "customer") navigate("/customer-dashboard");
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Lấy dữ liệu từ localStorage hoặc file JSON
    const lawyers = JSON.parse(localStorage.getItem("lawyers")) || lawyersData;
    const customers =
      JSON.parse(localStorage.getItem("customers")) || customersData;

    // Tìm lawyer hoặc customer
    const foundLawyer = lawyers.find(
      (user) =>
        (user.email || user.gmail) === email &&
        (user.password || "123456") === password
    );
    const foundCustomer = customers.find(
      (user) =>
        (user.email || user.gmail) === email &&
        (user.password || "123456") === password
    );

    if (foundLawyer) {
      foundLawyer.role = "lawyer";
      localStorage.setItem("loggedInUser", JSON.stringify(foundLawyer));
      navigate("/lawyer-dashboard");
    } else if (foundCustomer) {
      foundCustomer.role = "customer";
      localStorage.setItem("loggedInUser", JSON.stringify(foundCustomer));
      navigate("/customer-dashboard");
    } else {
      setError("Email hoặc mật khẩu không đúng.");
    }
  };

  return (
    <>
      <Header />
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "calc(100vh - 120px)",
          padding: "3rem 0",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Card style={{ width: "35rem", padding: "2rem 2.5rem", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
          <Card.Body>
            <h4 className="text-center mb-5 fw-bolder" style={{ color: "#17a2b8", textTransform: "uppercase" }}>
              LOGIN
            </h4>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-grid gap-2 mb-4">
                <Button variant="info" type="submit" className="py-2 text-uppercase fw-bold">
                  Login
                </Button>
              </div>

              <p className="text-center text-muted" style={{ fontSize: "0.9rem" }}>
                Chưa có tài khoản?{" "}
                <Link to="/registercustomer" className="fw-bold text-info">
                  Đăng ký ngay
                </Link>
              </p>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default Login;
