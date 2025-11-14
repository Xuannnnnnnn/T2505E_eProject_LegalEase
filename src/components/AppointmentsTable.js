import React from "react";
import { Button } from "react-bootstrap";
import { FaStar, FaCheckCircle } from "react-icons/fa"; 

const AppointmentsTable = ({
    appointments = [],
    role,
    onApprove,
    onReject,
    onComplete, 
    onView,
    onReview,   // Dùng cho Customer
    onStatusChange // Giữ lại cho tương thích (nhưng không dùng)
}) => {
    if (!appointments || appointments.length === 0) {
        return (
            <div className="text-center text-muted py-4">
                <h6>No appointments found.</h6>
            </div>
        );
    }

    const showLawyerActions = role === "lawyer";
    const showCustomerActions = role === "customer";
    const totalActionColumns = showLawyerActions || showCustomerActions; 

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'bg-success';
            case 'rejected':
                return 'bg-danger';
            case 'completed':
                return 'bg-primary';
            default:
                return 'bg-secondary';
        }
    };
    
    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle table-bordered">
                <thead className="table-info">
                    <tr>
                        <th>#</th>
                        {/* Thay đổi cột tùy theo vai trò nếu cần, nhưng giữ chung là Customer/Lawyer */}
                        <th>Customer</th> 
                        <th>Date</th>
                        <th>Time</th>
                        <th>Duration (min)</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        {totalActionColumns && <th>Actions</th>} 
                    </tr>
                </thead>

                <tbody>
                    {appointments.map((a, idx) => (
                        <tr key={a.id || idx}>
                            <td>{idx + 1}</td>
                            <td>{a.customer_name || a.lawyer_name || `User #${a.customer_id}`}</td>
                            <td>
                                {a.appointment_date 
                                    ? new Date(a.appointment_date).toLocaleDateString() 
                                    : a.date ? new Date(a.date).toLocaleDateString() : "-"}
                            </td>
                            <td>{a.appointment_time || a.time || "-"}</td>
                            <td>{a.slot_duration || 0}</td>
                            <td>
                                {a.total_price
                                    ? `$${parseFloat(a.total_price).toFixed(2)}`
                                    : "$0.00"}
                            </td>
                            <td>
                                <span className={`badge ${getStatusBadge(a.status)}`}>
                                    {a.status?.toUpperCase() || "PENDING"}
                                </span>
                            </td>

                            {totalActionColumns && (
                                <td>
                                    <div className="d-flex flex-wrap gap-2">
                                        
                                        {/* Nút VIEW (Chung) */}
                                        {onView && (
                                            <Button size="sm" variant="outline-info" onClick={() => onView(a)}>
                                                View
                                            </Button>
                                        )}

                                        {/* 🎯 LOGIC HÀNH ĐỘNG CỦA KHÁCH HÀNG (Review) */}
                                        {showCustomerActions && a.status === "completed" && (
                                            a.is_reviewed ? (
                                                <Button size="sm" variant="success" disabled>
                                                    <FaCheckCircle className="me-1" /> Reviewed
                                                </Button>
                                            ) : (
                                                <Button 
                                                    size="sm" 
                                                    variant="warning"
                                                    onClick={() => onReview && onReview(a)}
                                                >
                                                    <FaStar className="me-1" /> Review
                                                </Button>
                                            )
                                        )}
                                        {/* KẾT THÚC LOGIC ĐÁNH GIÁ */}


                                        {/* 🎯 HÀNH ĐỘNG CỦA LUẬT SƯ */}
                                        {showLawyerActions && (
                                            <>
                                                {/* 1. Nếu đang PENDING: Approve hoặc Reject */}
                                                {a.status === "pending" && (
                                                    <>
                                                        <Button size="sm" variant="success" onClick={() => onApprove && onApprove(a)}>Approve</Button>
                                                        <Button size="sm" variant="danger" onClick={() => onReject && onReject(a)}>Reject</Button>
                                                    </>
                                                )}

                                                {/* 2. Nếu đang APPROVED: Chỉ cho phép Complete */}
                                                {a.status === "approved" && (
                                                    <>
                                                        <Button size="sm" variant="primary" onClick={() => onComplete && onComplete(a)}>Complete</Button>
                                                    </>
                                                )}
                                                
                                                {/* 3. Nếu đang PENDING hoặc APPROVED, và không có nút khác, cho phép Reject (Logic này đã được đơn giản hóa trong Dashboard) */}
                                            </>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentsTable;