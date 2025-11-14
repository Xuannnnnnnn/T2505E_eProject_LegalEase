import React, { useState, useEffect } from "react";
import SidebarCustomer from "../components/SidebarCustomer";
import CustomerAppointments from "../pages/CustomerAppointments"; 
import CustomerProfile from "../pages/CustomerProfile"; 
import CustomerFeedback from "../pages/CustomerFeedback";
import ReviewFormModal from "../components/ReviewFormModal"; 

import { Modal, Button, Spinner, Container } from "react-bootstrap";
import { FaUserTie, FaCalendarAlt, FaStickyNote } from "react-icons/fa";

const BASE_URL = "http://localhost:3001";

// Hàm tiện ích: Lấy ngày bắt đầu và kết thúc của tuần hiện tại
const getCurrentWeekRange = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const format = (date) => date.toISOString().split('T')[0];

    return { start: format(startOfWeek), end: format(endOfWeek) };
};

// Hàm tiện ích: Sắp xếp cuộc hẹn theo trạng thái ưu tiên
const sortAppointments = (appts) => {
    const statusOrder = { pending: 1, approved: 2, completed: 3, rejected : 4 };
    return [...appts].sort((a, b) => {
        const orderA = statusOrder[a.status?.toLowerCase()] || 5;
        const orderB = statusOrder[b.status?.toLowerCase()] || 5;
        return orderA - orderB;
    });
};


const CustomerDashboard = () => {
    const [loggedCustomer, setLoggedCustomer] = useState(null);
    const [activeTab, setActiveTab] = useState("appointments");
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [statusFilter, setStatusFilter] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    
    // State quản lý Modal View
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // State quản lý Review Modal
    const [reviewAppointment, setReviewAppointment] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);


    // ✅ Hàm Logout
    const handleLogout = () => {
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("userRole");
        window.location.href = "/login";
    };

    // ✅ Hàm mở Modal chi tiết (Logic cho nút View)
    const handleViewDetails = (appointment) => {
        const lawyerInfo = lawyers.find(l => 
            String(l.id) === String(appointment.lawyer_id) || 
            l.email === appointment.lawyer_email
        );
        
        setSelectedAppointment({ 
            ...appointment, 
            lawyer_details: lawyerInfo,
        });
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedAppointment(null);
    };
    
    // ✅ Hàm mở Modal Đánh giá (Logic cho nút Review)
    const handleReviewClick = (appointment) => {
        setReviewAppointment(appointment);
        setIsReviewModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setIsReviewModalOpen(false);
        setReviewAppointment(null);
    };
    
    // ✅ Hàm xử lý sau khi Review thành công
    const handleReviewSubmitted = (reviewedAppointmentId) => {
        handleCloseReviewModal();
        
        // Cập nhật trạng thái is_reviewed trong state cục bộ
        const updatedAppointments = appointments.map(a => 
            a.id === reviewedAppointmentId ? { ...a, is_reviewed: true } : a
        );
        
        setAppointments(updatedAppointments);
        
        // FIX LỖI: Truyền mảng đã cập nhật vào handleSearch để tránh lỗi iterable
        handleSearch(updatedAppointments); 
    };


    // ✅ Lọc theo trạng thái và thời gian (Chạy khi nhấn Search)
    const handleSearch = (sourceAppointments) => {
        // FIX LỖI: Đảm bảo source là mảng hợp lệ, nếu không, dùng state 'appointments'
        const source = Array.isArray(sourceAppointments) ? sourceAppointments : appointments;
        
        let filtered = Array.isArray(source) ? [...source] : []; 
        
        if (statusFilter) {
            filtered = filtered.filter((a) => a.status?.toLowerCase() === statusFilter.toLowerCase());
        }
        
        // Chức năng lọc theo ngày
        if (fromDate) {
             filtered = filtered.filter((a) => a.appointment_date >= fromDate);
        }
        if (toDate) {
            filtered = filtered.filter((a) => a.appointment_date <= toDate);
        }

        setFilteredAppointments(filtered);
    };

    // ✅ Load danh sách luật sư và kiểm tra đăng nhập (Logic Data)
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const role = localStorage.getItem("userRole");

        if (!storedUser || role !== "customer") {
            window.location.href = "/login";
            return;
        }
        setLoggedCustomer(storedUser);
        
        const fetchLawyers = async () => {
            try {
                const res = await fetch(`${BASE_URL}/lawyers`);
                const data = await res.json();
                setLawyers(data.filter((l) => l.status === "Approved"));
            } catch (err) {
                console.error("Error loading lawyers:", err);
            }
        };
        fetchLawyers();
    }, []);
    
    // ✅ Load các cuộc hẹn và áp dụng lọc/sắp xếp mặc định
    useEffect(() => {
        if (!loggedCustomer) return;

        const fetchAppointments = async () => {
            try {
                const res = await fetch(`${BASE_URL}/appointments`);
                const data = await res.json();
                
                // 💡 LƯU Ý: Thêm trường is_reviewed mặc định cho mẫu
                const appointmentsWithReviewStatus = data.map(a => ({
                    ...a,
                    is_reviewed: a.is_reviewed || false 
                }));

                const myAppointments = appointmentsWithReviewStatus.filter((a) =>
                        a.customer_id === loggedCustomer.id ||
                        a.customer_email === loggedCustomer.email
                );
                
                const sortedAppointments = sortAppointments(myAppointments);
                setAppointments(sortedAppointments);

                // --- Thiết lập mặc định: Tuần hiện tại ---
                const weekRange = getCurrentWeekRange();
                setFromDate(weekRange.start);
                setToDate(weekRange.end);
                
                const defaultFiltered = sortedAppointments.filter((a) => {
                    const appointmentDateStr = a.appointment_date || a.date; 
                    if (!appointmentDateStr) return false;
                    
                    let normalizedDate = appointmentDateStr;
                    // Chuẩn hóa nếu ngày là DD/MM/YYYY
                    if (appointmentDateStr.includes('/')) {
                        const parts = appointmentDateStr.split('/');
                        if (parts.length === 3) {
                            normalizedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                        }
                    }
                    
                    return normalizedDate >= weekRange.start && normalizedDate <= weekRange.end;
                });

                setFilteredAppointments(defaultFiltered);

            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [loggedCustomer]);


    const renderTab = () => {
        if (loading) {
            return (
                <div className="text-center mt-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            );
        }
        
        // Giả định các components con đã được import
        switch (activeTab) {
            case "profile":
                return <CustomerProfile customer={loggedCustomer} />;
            
            case "appointments":
                return (
                    <CustomerAppointments 
                        appointments={filteredAppointments} 
                        handleViewDetails={handleViewDetails}
                        handleReviewClick={handleReviewClick} 
                        handleSearch={handleSearch}
                        statusFilter={statusFilter}
                        fromDate={fromDate}
                        toDate={toDate}
                        setStatusFilter={setStatusFilter}
                        setFromDate={setFromDate}
                        setToDate={setToDate}
                        loading={loading}
                    />
                );
            
            case "feedback":
                return <CustomerFeedback customer={loggedCustomer} />;

            default:
                return <div>Welcome to your Dashboard.</div>;
        }
    };

    if (!loggedCustomer && !loading) {
        return <div className="text-center mt-5">Redirecting to login...</div>;
    }


    return (
        <div className="d-flex vh-100">
            <SidebarCustomer
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={handleLogout}
            />

            <Container fluid className="p-4 overflow-auto">
                <h3 className="mb-4 text-primary">Customer Dashboard</h3>
                {renderTab()}
            </Container>

            {/* 1. Modal hiển thị chi tiết (View) */}
            <Modal show={isDetailModalOpen} onHide={handleCloseDetailModal} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Appointment Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAppointment ? (
                        <>
                            <h5 className="mb-2 text-primary"><FaUserTie className="me-2" />Lawyer Information</h5>
                            <div className="border rounded p-3 mb-4 bg-light">
                                {selectedAppointment.lawyer_details ? (
                                    <>
                                        <p className="mb-1"><strong>Name:</strong> {selectedAppointment.lawyer_details.name}</p>
                                        <p className="mb-1"><strong>Email:</strong> {selectedAppointment.lawyer_details.email || "N/A"}</p>
                                        <p className="mb-1">
                                            <strong>Specialty/Summary:</strong> {selectedAppointment.lawyer_details.profile_summary || "Not specified"}
                                        </p>
                                        <p className="mb-1 text-muted small">
                                            (Other: {selectedAppointment.lawyer_details.other || "N/A"})
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-muted mb-0">Lawyer details not available.</p>
                                )}
                            </div>

                            <h5 className="mb-2 text-primary"><FaCalendarAlt className="me-2" />Appointment & Status</h5>
                            <div className="border rounded p-3 mb-4">
                                <p className="mb-1">
                                    <strong>Date & Time:</strong> {selectedAppointment.appointment_date} @ {selectedAppointment.appointment_time}
                                </p>
                                <p className="mb-1">
                                    <strong>Duration:</strong> {selectedAppointment.slot_duration} min
                                </p>
                                <p className="mb-1">
                                    <strong>Status:</strong>{" "}
                                    <span className={`fw-bold text-${selectedAppointment.status === 'approved' ? 'success' : selectedAppointment.status === 'pending' ? 'warning' : selectedAppointment.status === 'completed' ? 'primary' : 'danger'}`}>
                                        {selectedAppointment.status?.toUpperCase()}
                                    </span>
                                </p>
                                <p className="mb-1">
                                    <strong>Price:</strong> ${selectedAppointment.total_price || 'N/A'}
                                </p>
                            </div>

                            <h5 className="mb-2 text-primary"><FaStickyNote className="me-2" />Customer Message</h5>
                            <div className="alert alert-secondary p-3 mb-0">
                                {selectedAppointment.notes || "No message provided."}
                            </div>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDetailModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* 2. Modal Đánh giá (Review) */}
            <ReviewFormModal 
                show={isReviewModalOpen}
                handleClose={handleCloseReviewModal}
                appointment={reviewAppointment}
                onReviewSubmitted={handleReviewSubmitted}
                customerId={loggedCustomer?.id}
            />
        </div>
    );
};

export default CustomerDashboard;