import React, { useState } from "react";
import { Navbar, Container, Nav, Form, FormControl, Button, NavDropdown} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import specializations from '../data/specializations.json'; 
import "../App.css";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    const query = new URLSearchParams({ keyword }).toString();
    navigate(`/search?${query}`);
    setShowSearch(false);
  };

  // HÀM XỬ LÝ CHUYỂN HƯỚNG TÌM KIẾM THEO CHUYÊN MÔN
  const handleSpecializationClick = (name) => {
    // 🎯 CHUYỂN HƯỚNG NGAY LẬP TỨC ĐẾN TRANG TÌM KIẾM VỚI THAM SỐ CHUYÊN MÔN
    const query = new URLSearchParams({ specialization: name }).toString();
    navigate(`/search?${query}`);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const categories = specializations.slice(0, 10); 

  return (
    <>
      <Navbar bg="light" expand="lg" className="shadow-sm py-2 header-navbar">
        <Container className="d-flex align-items-center justify-content-between">
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold d-flex align-items-center"
            style={{ fontSize: "1.4rem", color: "#1a237e", textDecoration: "none" }}
          >
            {/* Logo/Thương hiệu */}
            ⚖️ <span className="ms-1 text-warning">Legal</span>
            <span style={{ color: "#1a237e" }}>Ease</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="align-items-center gap-3">

              {/* NAVDROPDOWN ĐÃ THÊM MŨI TÊN ▼ VÀO TITLE */}
              <NavDropdown
                // 🎯 SỬA: Thêm biểu tượng mũi tên chỉ xuống vào title
                title={<span className="text-dark fw-semibold">Explore LegalEase</span>} 
                id="basic-nav-dropdown"
                className="text-dark fw-semibold"
              >
                {/* Dùng .map() để tạo các mục từ dữ liệu JSON */}
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

              {/* Link Đăng nhập (Log In) */}
              <Nav.Link
                onClick={() => handleNavigation('/login')}
                className="text-dark fw-semibold cursor-pointer"
              >
                Log In
              </Nav.Link>
              <Nav.Link
                onClick={() => handleNavigation('/registercustomer')}
                className="text-dark fw-semibold cursor-pointer"
              >
                Register
              </Nav.Link>

              {/* Biểu tượng Search */}
              <FaSearch
                size={18}
                style={{ cursor: "pointer", color: "#1a237e" }}
                onClick={() => setShowSearch(!showSearch)}
              />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Thanh tìm kiếm mở rộng */}
      {showSearch && (
        <div className="search-bar-container text-center py-3 bg-light shadow-sm">
          <Container>
            <Form className="d-flex justify-content-center" onSubmit={handleSearch}>
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
      )}
    </>
  );
};

export default Header;