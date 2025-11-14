import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

const BASE_URL = "http://localhost:3001";

const ReviewFormModal = ({ show, handleClose, appointment, onReviewSubmitted, customerId }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset state khi modal đóng
    React.useEffect(() => {
        if (!show) {
            setRating(0);
            setComment("");
            setIsSubmitting(false);
        }
    }, [show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Kiểm tra ràng buộc cơ bản
        if (rating === 0) return alert("Please select a star rating.");
        if (!appointment || !customerId) {
            alert("Error: Missing appointment or customer ID data.");
            return;
        }

        setIsSubmitting(true);

        const reviewData = {
            appointment_id: appointment.id,
            lawyer_id: appointment.lawyer_id,
            customer_id: customerId,
            rating: rating,
            comment: comment,
            review_date: new Date().toISOString(),
        };

        try {
            // --- BƯỚC 1: Gửi review lên endpoint /reviews ---
            const resReview = await fetch(`${BASE_URL}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reviewData),
            });

            if (!resReview.ok) {
                const errorText = await resReview.text();
                // Ném lỗi cụ thể hơn để dễ debug
                throw new Error(`Review POST failed: ${resReview.statusText} - ${errorText}`);
            }

            // --- BƯỚC 2: Cập nhật trạng thái 'is_reviewed' trong appointment ---
            await fetch(`${BASE_URL}/appointments/${appointment.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_reviewed: true }),
            });
            
            // --- BƯỚC 3: Hoàn tất và gọi callback ---
            alert("Review submitted successfully!"); 
            onReviewSubmitted(appointment.id);

        } catch (error) {
            console.error("Error submitting review:", error.message);
            alert(`Error submitting review. Please check your network or JSON Server setup. Details: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = () => {
        return [...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
                <FaStar
                    key={index}
                    size={30}
                    color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                    onClick={() => setRating(ratingValue)}
                    style={{ cursor: 'pointer', transition: 'color 200ms' }}
                />
            );
        });
    };

    // 🎯 Lấy tên luật sư đã được đính kèm
    const lawyerDisplay = appointment?.lawyer_name || `Lawyer ID: ${appointment?.lawyer_id}`;

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                {/* SỬA TITLE: Hiển thị tên Luật sư và Ngày cuộc hẹn */}
                <Modal.Title>Review Appointment with {lawyerDisplay} on {appointment?.appointment_date}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Cập nhật nội dung mô tả */}
                <p>You are submitting a review for the appointment with 
                   **{lawyerDisplay}**.
                </p>
                
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 text-center">
                        <Form.Label as="h5">Your Rating:</Form.Label>
                        <div className="d-flex justify-content-center gap-1">
                            {renderStars()}
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Your Comment (Optional):</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Share your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={isSubmitting || rating === 0}>
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ReviewFormModal;