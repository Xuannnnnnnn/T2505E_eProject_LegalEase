import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Pages
import HomePage from "./pages/HomePage";
import SearchLawyerPage from "./pages/SearchLawyerPage";
import LawyerInformation from "./pages/LawyerInformation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import AppointmentHistoryPage from "./pages/AppointmentHistoryPage";

// ✅ Components (nếu bạn có thanh menu & footer)
import Header from "./components/Header";
import Footer from "./components/Footer";

// ✅ Styles
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      

      {/* 🌟 Nội dung chính của từng trang */}
      <main className="flex-grow-1">
        <Routes>
          {/* Trang chủ */}
          <Route path="/" element={<HomePage />} />

          {/* Trang tìm kiếm luật sư */}
          <Route path="/search" element={<SearchLawyerPage />} />

          {/* Trang thông tin chi tiết luật sư */}
          <Route path="/lawyer/:id" element={<LawyerInformation />} />

          {/* Trang đăng nhập / đăng ký */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Trang thanh toán */}
          <Route path="/payment" element={<PaymentPage />} />

          {/* Trang xác nhận thanh toán thành công */}
          <Route path="/payment-success" element={<PaymentSuccess />} />

          {/* Trang xem lịch sử cuộc hẹn */}
          <Route
            path="/appointment-history"
            element={<AppointmentHistoryPage />}
          />

          {/* Trang lỗi 404 */}
          <Route
            path="*"
            element={
              <div className="container text-center py-5">
                <h3 className="text-danger fw-bold">404 - Page Not Found</h3>
                <p className="text-muted">
                  The page you are looking for does not exist.
                </p>
              </div>
            }
          />
        </Routes>
      </main>

      {/* 🌐 Footer dùng chung */}
      <Footer />
    </Router>
  );
}

export default App;
