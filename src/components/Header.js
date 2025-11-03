import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, Form, FormControl, Button, NavDropdown } from "react-bootstrap";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import specializations from "../data/specializations.json";
import "../App.css";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const userRole = localStorage.getItem("userRole");
    if (loggedInUser) {
      setUser(loggedInUser);
      setRole(userRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    setUser(null);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    setShowSearch(false);
  };

  const handleSpecializationClick = (name) => {
    navigate(`/search?specialization=${encodeURIComponent(name)}`);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const categories = specializations.slice(0, 10);
  const dashboardPath =
    role === "customer"
      ? "/customer-dashboard"
      : role === "lawyer"
      ? "/lawyer-dashboard"
      : "/login";

  return (
    <>
      <Navbar bg="light" expand="lg" className="shadow-sm py-2 header-navbar">
        <Container className="d-flex align-items-center justify-content-between">
          {/* Logo */}
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold d-flex align-items-center"
            style={{ fontSize: "1.4rem", color: "#1a237e", textDecoration: "none" }}
          >
            ⚖️ <span className="ms-1 text-warning">Legal</span>
            <span style={{ color: "#1a237e" }}>Ease</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="align-items-center gap-3">
              {/* Explore menu */}
              <NavDropdown
                title={<span className="text-dark fw-semibold">Explore LegalEase</span>}
                id="basic-nav-dropdown"
              >
                {categories.map((item) => (
                  <NavDropdown.Item
                    key={item.specialization_id}
                    onClick={() => handleSpecializationClick(item.name)}
                  >
                    {item.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>

              <span className="border-end mx-1" style={{ height: "20px" }}></span>

              {/* Login / User */}
              {!user ? (
                <>
                  <Nav.Link
                    onClick={() => handleNavigation("/login")}
                    className="text-dark fw-semibold cursor-pointer"
                    style={{ minWidth: "120px" }}
                  >
                    Login
                  </Nav.Link>

                  <Nav.Link
                    onClick={() => handleNavigation("/registercustomer")}
                    className="text-dark fw-semibold cursor-pointer"
                    style={{ minWidth: "120px" }}
                  >
                    Register
                  </Nav.Link>
                </>
              ) : (
                <NavDropdown
                  title={
                    <span
                      className="text-dark fw-semibold d-flex align-items-center"
                      style={{ minWidth: "120px" }}
                    >
                      <FaUserCircle className="me-1" />
                      {user.fullname || user.name || user.username}
                    </span>
                  }
                  id="user-nav-dropdown"
                >
                  <NavDropdown.Item onClick={() => handleNavigation(dashboardPath)}>
                    Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              )}

              {/* Search icon */}
              <FaSearch
                size={18}
                style={{ cursor: "pointer", color: "#1a237e" }}
                onClick={() => setShowSearch(!showSearch)}
              />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Search bar */}
      <div className={`search-bar-container ${showSearch ? "show" : ""}`}>
        <Container>
          <Form className="d-flex justify-content-center py-3" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search lawyers, categories..."
              className="me-2 w-50"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button variant="primary" type="submit">
              Search
            </Button>
          </Form>
        </Container>
      </div>
    </>
  );
};

export default Header;
