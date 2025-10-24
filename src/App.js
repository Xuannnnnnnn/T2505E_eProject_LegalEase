import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, Navigate } from "react";

// ✅ Pages
import HomePage from "./pages/HomePage";
import SearchLawyerPage from "./pages/SearchLawyerPage";
import LawyerInformation from "./pages/LawyerInformation";
import Login from "./pages/Login";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import AppointmentHistoryPage from "./pages/AppointmentHistoryPage";
import LoginAdmin from "./pages/LoginAdmin";
import AdminDashboard from "./pages/AdminDashboard";
import RegisterCustomer from "./pages/RegisterCustomer";
import RegisterLawyer from "./pages/RegisterLawyer";
import NewsPage from "./pages/NewsPage";
import NewsDetail from "./pages/NewsDetail";
import AdminAppointments from "./pages/AdminAppointments";
import LawyerDashboard from "./pages/LawyerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import { setupData } from "./utils/setupData";


// ✅ Styles
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  // Setup data vào localStorage lần đầu
  useEffect(() => {
    setupData();
  }, []);

  // Hàm kiểm tra user đã login chưa
  const isLoggedIn = () => !!localStorage.getItem("loggedInUser");

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

          {/* Trang tin tức */}
          <Route path="/news" element={<NewsPage />} />

          {/* Trang chi tiết tin tức */}
          <Route path="/news/:id" element={<NewsDetail />} />

          {/* Trang đăng nhập / đăng ký */}
          <Route path="/login" element={<Login />} />
          <Route path="/registercustomer" element={<RegisterCustomer />} />
          <Route path="/registerlawyer" element={<RegisterLawyer />} />

          {/* Trang thanh toán */}
          <Route path="/payment" element={<PaymentPage />} />

          {/* Trang xác nhận thanh toán thành công */}
          <Route path="/payment-success" element={<PaymentSuccess />} />

          {/* Trang xem lịch sử cuộc hẹn */}
          <Route
            path="/appointment-history"
            element={<AppointmentHistoryPage />}
          />
          {/* Trang đăng nhập Admin */}
          <Route path="/admin/login" element={<LoginAdmin />} />

          {/* Trang dashboard Admin, Lawyer, Customer */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          {/* Trang Appointments Admin */}
          <Route path="/admin/appointments" element={<AdminAppointments />} />


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
          {/* Dashboard luật sư */}
          <Route
            path="/lawyer-dashboard/*"
            element={
              isLoggedIn() ? (
                <LawyerDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Dashboard khách hàng */}
          <Route
            path="/customer-dashboard/*"
            element={
              isLoggedIn() ? (
                <CustomerDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Catch-all redirect về login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
