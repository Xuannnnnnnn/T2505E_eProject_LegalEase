import { 
  FaUserTie, 
  FaUsers, 
  FaFileInvoiceDollar, 
  FaNewspaper, 
  FaChartBar, 
  FaExchangeAlt, 
  FaSignOutAlt,
  FaCalendarAlt,
  FaTachometerAlt
} from "react-icons/fa";
import { Nav } from "react-bootstrap";

const SidebarAdmin = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: "dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
    { id: "lawyers", icon: <FaUserTie />, label: "Manage Lawyers" },
    { id: "transactions", icon: <FaExchangeAlt />, label: "Manage Transactions" },
    { id: "customers", icon: <FaUsers />, label: "Manage Customers" },
    { id: "appointments", icon: <FaCalendarAlt />, label: "Manage Appointments" },
    { id: "fees", icon: <FaFileInvoiceDollar />, label: "Manage Fees" },
    { id: "content", icon: <FaNewspaper />, label: "Manage Content" },
    { id: "reports", icon: <FaChartBar />, label: "View Reports" },
  ];

  return (
    <div 
      className="d-flex flex-column bg-dark text-white p-3 vh-100" 
      style={{ width: "250px" }}
    >
      <h3 className="text-center mb-4">Admin Panel</h3>
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

export default SidebarAdmin;
