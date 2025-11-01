import { 
  FaHome,
  FaCalendarAlt, 
  FaUser, 
  FaCommentDots, 
  FaSignOutAlt 
} from "react-icons/fa";
import { Nav } from "react-bootstrap";

const SidebarCustomer = ({ activeTab, setActiveTab, onLogout }) => {
  // ✅ Quay lại trang chủ (root "/")
  const handleGoHome = () => {
    window.location.href = "/"; // 👈 Đây là trang chủ thật của bạn
  };

  const menuItems = [
    { id: "profile", icon: <FaUser />, label: "My Profile" },
    { id: "appointments", icon: <FaCalendarAlt />, label: "My Appointments" },
    { id: "feedback", icon: <FaCommentDots />, label: "Feedback" },
  ];

  return (
    <div 
      className="d-flex flex-column bg-dark text-white p-3 vh-100" 
      style={{ width: "250px" }}
    >
      <h3 className="text-center mb-4">Customer Panel</h3>

      {/* 🏠 Home Button */}
      <button
        onClick={handleGoHome}
        className="btn btn-outline-light mb-3 d-flex align-items-center justify-content-start"
      >
        <FaHome className="me-2" /> Home
      </button>

      {/* Navigation Menu */}
      <Nav className="flex-column">
        {menuItems.map((item) => (
          <Nav.Link
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`text-white mb-2 d-flex align-items-center ${
              activeTab === item.id ? "bg-primary rounded" : ""
            }`}
          >
            <span className="me-2">{item.icon}</span> {item.label}
          </Nav.Link>
        ))}
      </Nav>

      {/* 🔹 Logout Button */}
      <div className="mt-auto">
        <button
          onClick={onLogout}
          className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
        >
          <FaSignOutAlt className="me-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default SidebarCustomer;
