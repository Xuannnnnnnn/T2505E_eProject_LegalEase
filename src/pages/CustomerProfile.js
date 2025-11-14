import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import { FaEdit, FaSave, FaTimes, FaCheckCircle } from 'react-icons/fa';

const BASE_URL = "http://localhost:3001"; 

// Component này cho phép khách hàng xem và cập nhật thông tin cá nhân
const CustomerProfile = ({ customer }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  // Khởi tạo formData khi component mount hoặc khi customer prop thay đổi
  useEffect(() => {
    if (customer) {
      // Đảm bảo chỉ lấy các trường có thể chỉnh sửa
      setFormData({
        fullname: customer.fullname || '',
        phone: customer.phone || '',
        address: customer.address || '',
        dob: customer.dob || '', // Giả định đã ở định dạng YYYY-MM-DD
        gender: customer.gender || '',
        // Các trường khác như email, id, status, register_date không cho phép sửa
      });
      setStatus({ message: '', type: '' }); // Xóa thông báo lỗi khi tải lại
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ message: '', type: '' });

    // 💡 Logic Gửi Cập Nhật Lên Server
    try {
      const res = await fetch(`${BASE_URL}/customers/${customer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedCustomer = await res.json();
        
        // Cập nhật localStorage (nếu cần thiết, hoặc Dashboard sẽ tự fetch lại)
        // Lưu ý: Trong môi trường thực tế, bạn cần gọi hàm cập nhật state của component cha
        // hoặc làm mới token/session. Ở đây, ta chỉ cập nhật localStorage để mô phỏng.
        const updatedLocalUser = { ...customer, ...formData };
        localStorage.setItem("loggedInUser", JSON.stringify(updatedLocalUser));
        
        setStatus({ message: 'Profile updated successfully!', type: 'success' });
        setIsEditing(false);
      } else {
        setStatus({ message: 'Failed to update profile. Server error.', type: 'danger' });
      }
    } catch (error) {
      console.error("Update error:", error);
      setStatus({ message: 'Network error or internal issue.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form về dữ liệu ban đầu
    setFormData({
      fullname: customer.fullname || '',
      phone: customer.phone || '',
      address: customer.address || '',
      dob: customer.dob || '',
      gender: customer.gender || '',
    });
    setIsEditing(false);
    setStatus({ message: '', type: '' });
  };

  if (!customer) {
    return <p className="text-danger">Customer data not loaded.</p>;
  }

  // --- JSX Hiển thị & Chỉnh sửa ---
  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <h4 className="text-primary mb-4">My Profile</h4>
      
      {status.message && (
        <Alert variant={status.type} className="d-flex align-items-center">
          <FaCheckCircle className="me-2" />
          {status.message}
        </Alert>
      )}

      <Form onSubmit={handleSave}>
        <div className="row g-3">
          {/* Cột 1: Thông tin cơ bản (Không chỉnh sửa) */}
          <div className="col-md-6">
            <h5 className="text-secondary">Account Details</h5>
            <p><strong>ID:</strong> {customer.id}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Registered:</strong> {new Date(customer.register_date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span className="badge bg-success">{customer.status}</span></p>
          </div>
          
          {/* Cột 2: Thông tin cá nhân (Chỉnh sửa được) */}
          <div className="col-md-6">
            <h5 className="text-secondary">Personal Information</h5>
            
            {/* Full Name */}
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullname"
                value={isEditing ? formData.fullname : customer.fullname}
                onChange={handleChange}
                readOnly={!isEditing || loading}
                required
              />
            </Form.Group>

            {/* Phone */}
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={isEditing ? formData.phone : customer.phone}
                onChange={handleChange}
                readOnly={!isEditing || loading}
              />
            </Form.Group>

            {/* Address */}
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={isEditing ? formData.address : customer.address}
                onChange={handleChange}
                readOnly={!isEditing || loading}
              />
            </Form.Group>

            {/* Date of Birth */}
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={isEditing ? formData.dob : customer.dob}
                onChange={handleChange}
                readOnly={!isEditing || loading}
              />
            </Form.Group>

            {/* Gender */}
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={isEditing ? formData.gender : customer.gender}
                onChange={handleChange}
                disabled={!isEditing || loading}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

          </div>
        </div>

        {/* 🚀 Actions Buttons */}
        <div className="mt-4 pt-3 border-top d-flex justify-content-end gap-2">
          {!isEditing ? (
            // Nút Edit
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              <FaEdit className="me-2" />
              Edit Profile
            </Button>
          ) : (
            // Nút Save và Cancel khi đang Editing
            <>
              <Button variant="secondary" onClick={handleCancel} disabled={loading}>
                <FaTimes className="me-2" />
                Cancel
              </Button>
              <Button variant="success" type="submit" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <FaSave className="me-2" />}
                Save Changes
              </Button>
            </>
          )}
        </div>
      </Form>
    </div>
  );
};

export default CustomerProfile;