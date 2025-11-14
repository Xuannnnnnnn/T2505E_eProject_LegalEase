import { 
  FaCalendarAlt, 
  FaUser, 
  FaFileAlt, 
  FaChartLine, 
  FaSignOutAlt, 
  FaClock 
} from "react-icons/fa";
import { Nav } from "react-bootstrap";

const SidebarLawyer = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: "profile", icon: <FaUser />, label: "My Profile" },
    { id: "schedule", icon: <FaClock />, label: "Manage Schedules" }, // ✅ thêm dòng này
    { id: "appointments", icon: <FaCalendarAlt />, label: "Manage Appointments" },
    { id: "reports", icon: <FaChartLine />, label: "Reports" },
  ];

  return (
    <div 
      className="d-flex flex-column bg-dark text-white p-3 vh-100" 
      style={{ width: "250px" }}
    >
      <h3 className="text-center mb-4">Lawyer Panel</h3>

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

export default SidebarLawyer;
