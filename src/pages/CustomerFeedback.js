import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { FaStar, FaCheckCircle } from 'react-icons/fa';

const BASE_URL = "http://localhost:3001";

// Component con để render thông tin Review
const ReviewItem = ({ review, lawyers }) => {
    // 💡 FIX LỖI: Đảm bảo lawyers là mảng trước khi dùng .find()
    const validLawyers = Array.isArray(lawyers) ? lawyers : [];
    
    // Tìm tên luật sư
    const lawyer = validLawyers.find(l => String(l.id) === String(review.lawyer_id));
    // Sửa để hiển thị tên đầy đủ
    const lawyerName = lawyer ? lawyer.name : `Lawyer ID: ${review.lawyer_id}`; 

    // Hàm render sao
    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
                <FaStar
                    key={index}
                    size={20}
                    color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                />
            );
        });
    };

    return (
        <div className="list-group-item list-group-item-action flex-column align-items-start shadow-sm mb-3">
            <div className="d-flex w-100 justify-content-between mb-2">
                {/* 🛑 FIX: Đã sửa lỗi biến từ {lawyers_Name} thành {lawyerName} */}
                <h5 className="mb-1 text-primary">{lawyerName}</h5> 
                <small className="text-muted">
                    {new Date(review.review_date).toLocaleDateString()}
                </small>
            </div>
            
            {/* Điểm số đánh giá */}
            <p className="mb-2">
                {renderStars(review.rating)}
                <strong className="ms-2 text-dark">({review.rating}/5)</strong>
            </p>

            {/* Nội dung nhận xét */}
            <p className="mb-1 fst-italic">"{review.comment}"</p>
            
            <small className="text-muted mt-2 d-block">
                Appointment ID: {review.appointment_id}
            </small>
        </div>
    );
};

// Component chính
const CustomerFeedback = ({ customer, lawyers }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const customerId = customer?.id; 

    // ✅ Fetch tất cả reviews của khách hàng này
    useEffect(() => {
        if (!customerId) return;

        const fetchReviews = async () => {
            try {
                // Lọc theo customer_id
                const res = await fetch(`${BASE_URL}/reviews?customer_id=${customerId}`);
                const data = await res.json();
                
                // Sắp xếp theo ngày đánh giá mới nhất
                const sortedReviews = data.sort((a, b) => 
                    new Date(b.review_date) - new Date(a.review_date)
                );
                
                setReviews(sortedReviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [customerId]);

    return (
        <div className="p-4 border rounded bg-white shadow-sm">
            <h4 className="text-primary mb-4">My Past Reviews ({reviews.length})</h4>
            
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" size="sm" /> Loading reviews...
                </div>
            ) : reviews.length === 0 ? (
                <div className="alert alert-warning text-center">
                    You have not submitted any reviews yet.
                </div>
            ) : (
                <div className="d-grid gap-2">
                    {reviews.map((review, index) => (
                        <ReviewItem 
                            key={index} 
                            review={review} 
                            lawyers={lawyers} // Truyền danh sách luật sư để mapping tên
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerFeedback;