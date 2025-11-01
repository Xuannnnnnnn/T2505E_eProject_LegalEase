import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import customersData from "../data/customers.json";
import lawyersData from "../data/lawyers.json";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); // để nhận state redirect

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Load JSON vào localStorage nếu chưa có
  useEffect(() => {
    if (!localStorage.getItem("customers")) {
      localStorage.setItem("customers", JSON.stringify(customersData));
    }
    if (!localStorage.getItem("lawyers")) {
      localStorage.setItem("lawyers", JSON.stringify(lawyersData));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const lawyers = JSON.parse(localStorage.getItem("lawyers")) || [];

    let user = null;
    if (role === "customer") {
      user = customers.find((u) => u.email === email);
    } else {
      user = lawyers.find((u) => u.email === email);
    }

    if (!user || password !== "123456") {
      setError("Incorrect email or password!");
      return;
    }

    // Save user info
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    localStorage.setItem("userRole", role);

    // Nếu có redirect từ booking
    if (location.state?.appointmentForm && location.state?.redirectBack) {
      localStorage.setItem(
        "pendingAppointment",
        JSON.stringify(location.state.appointmentForm)
      );
      navigate(location.state.redirectBack);
      return;
    }

    // Bình thường login
    if (role === "customer") navigate("/customer-dashboard");
    else navigate("/lawyer-dashboard");
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const existingUser = customers.find((u) => u.email === email);

    if (existingUser) {
      setError("This email is already registered!");
      return;
    }

    const newUser = {
      customer_id: Date.now(),
      username: email.split("@")[0],
      email,
      password_hash: "123456",
      fullname: "New Customer",
      phone: "",
      address: "",
      register_date: new Date().toISOString().split("T")[0],
      status: "Active",
    };

    customers.push(newUser);
    localStorage.setItem("customers", JSON.stringify(customers));

    alert("Registration successful! You can now log in.");
    setIsRegistering(false);
  };

  return (
    <>
    <Header/>
    <div className="container mt-5" style={{ maxWidth: "480px" }}>
      <h3 className="text-center mb-4 text-primary">
        {isRegistering ? "Register Account" : "Login to LegalEase"}
      </h3>

      <Form onSubmit={isRegistering ? handleRegister : handleLogin}>
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

        {!isRegistering && (
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Default: 123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
        )}

        {!isRegistering && (
          <Form.Group className="mb-3">
            <Form.Label>Login as</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="customer">Customer</option>
              <option value="lawyer">Lawyer</option>
            </Form.Select>
          </Form.Group>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        <Button variant="primary" type="submit" className="w-100">
          {isRegistering ? "Register" : "Login"}
        </Button>

        <div className="text-center mt-3">
          {isRegistering ? (
            <>
              <span>Already have an account? </span>
              <Button
                variant="link"
                onClick={() => {
                  setIsRegistering(false);
                  setError("");
                }}
              >
                Login
              </Button>
            </>
          ) : (
            <>
              <span>Don't have an account? </span>
              <Button
                variant="link"
                onClick={() => {
                  setIsRegistering(true);
                  setError("");
                }}
              >
                Register
              </Button>
            </>
          )}
        </div>
      </Form>
    </div>
    <Footer/>
    </>
  );
};

export default Login;
