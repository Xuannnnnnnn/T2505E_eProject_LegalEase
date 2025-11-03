import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarLawyer from "../components/SidebarLawyer";
import LawyerScheduleManager from "../components/LawyerScheduleManager";
import AppointmentsTable from "../components/AppointmentsTable";

const API_BASE = "http://localhost:3001";

const LawyerDashboard = () => {
  const navigate = useNavigate();

  const [loggedLawyer, setLoggedLawyer] = useState(null);
  const [activeTab, setActiveTab] = useState("schedule");
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  // ✅ Kiểm tra login luật sư
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const role = localStorage.getItem("userRole");

    if (!storedUser || role !== "lawyer") {
      navigate("/login");
      return;
    }
    setLoggedLawyer(storedUser);
  }, [navigate]);

  // ✅ Load appointments khi vào tab Appointments
  useEffect(() => {
    if (!loggedLawyer || activeTab !== "appointments") return;

    setLoadingAppointments(true);
    fetch(`${API_BASE}/appointments?lawyer_id=${loggedLawyer.lawyer_id || loggedLawyer.id}`)
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        setLoadingAppointments(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingAppointments(false);
      });
  }, [loggedLawyer, activeTab]);

  // ✅ Update status appointment
  const updateAppointmentStatus = async (a, status) => {
    try {
      const res = await fetch(`${API_BASE}/appointments/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      const updated = await res.json();
      setAppointments((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update appointment status");
    }
  };

  const handleApprove = (a) => updateAppointmentStatus(a, "approved");
  const handleReject = (a) => updateAppointmentStatus(a, "rejected");

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  if (!loggedLawyer) {
    return <div className="text-center mt-5 text-secondary">Loading dashboard...</div>;
  }

  // ✅ Component Profile View/Edit
  const ProfileSection = ({ lawyer, onSave }) => {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ ...lawyer });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      try {
        const res = await fetch(`${API_BASE}/lawyers/${lawyer.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to save profile");

        const updated = await res.json();
        onSave(updated);
        setSaving(false);
        setEditMode(false);
        alert("Profile updated successfully!");
      } catch (err) {
        console.error(err);
        setSaving(false);
        alert("Failed to update profile");
      }
    };

    if (!editMode) {
      return (
        <div>
          <div className="d-flex align-items-center mb-3">
            <img
              src={lawyer.image}
              alt="Lawyer"
              className="rounded-circle me-3"
              width={100}
              height={100}
            />
            <div>
              <h5>{lawyer.name}</h5>
              <p className="mb-1"><strong>Email:</strong> {lawyer.email}</p>
              <p className="mb-1"><strong>Phone:</strong> {lawyer.phone}</p>
              <p className="mb-1"><strong>Address:</strong> {lawyer.address}</p>
            </div>
          </div>

          <p><strong>DOB:</strong> {lawyer.dob}</p>
          <p><strong>Gender:</strong> {lawyer.gender}</p>
          <p><strong>City:</strong> {lawyer.city}</p>
          <p><strong>Experience (years):</strong> {lawyer.experience_years}</p>
          <p><strong>Profile Summary:</strong> {lawyer.profile_summary}</p>
          <p><strong>Degree File:</strong> {lawyer.degree_file}</p>
          <p><strong>License File:</strong> {lawyer.license_file}</p>
          <p><strong>Certificates:</strong> {lawyer.certificates}</p>
          <p><strong>Verified:</strong> {lawyer.verify_status ? "Yes" : "No"}</p>

          <button className="btn btn-primary mt-3" onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Name</label>
            <input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Password</label>
            <input
              type="text"
              name="password_hash"
              value={formData.password_hash || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="form-select"
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label>Phone</label>
            <input
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Address</label>
            <input
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>City</label>
            <input
              name="city"
              value={formData.city || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Experience Years</label>
            <input
              type="number"
              name="experience_years"
              value={formData.experience_years || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Profile Summary</label>
            <textarea
              name="profile_summary"
              value={formData.profile_summary || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Image URL</label>
            <input
              name="image"
              value={formData.image || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Degree File</label>
            <input
              name="degree_file"
              value={formData.degree_file || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>License File</label>
            <input
              name="license_file"
              value={formData.license_file || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Certificates</label>
            <input
              name="certificates"
              value={formData.certificates || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-check mb-3">
            <input
              type="checkbox"
              name="verify_status"
              checked={formData.verify_status || false}
              onChange={handleChange}
              className="form-check-input"
            />
            <label className="form-check-label">Verified</label>
          </div>
        </div>

        <button type="submit" className="btn btn-success me-2" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setEditMode(false)}
        >
          Cancel
        </button>
      </form>
    );
  };

  return (
    <div className="d-flex vh-100">
      <SidebarLawyer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="flex-grow-1 p-4 overflow-auto">
        <h3 className="mb-4 text-primary">Lawyer Dashboard</h3>

        <div className="mb-3">
          <button
            className={`btn me-2 ${activeTab === "schedule" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab("schedule")}
          >
            Manage Schedule
          </button>
          <button
            className={`btn me-2 ${activeTab === "appointments" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab("appointments")}
          >
            Appointments
          </button>
          <button
            className={`btn ${activeTab === "profile" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab("profile")}
          >
            My Profile
          </button>
        </div>

        {activeTab === "schedule" && (
          <div>
            <h5>Configure your available slots</h5>
            <LawyerScheduleManager lawyerId={loggedLawyer.id || loggedLawyer.lawyer_id} />
          </div>
        )}

        {activeTab === "appointments" && (
          <div>
            <h5>Customer Appointments</h5>
            {loadingAppointments ? (
              <div>Loading appointments...</div>
            ) : (
              <AppointmentsTable
                appointments={appointments}
                role="lawyer"
                onApprove={handleApprove}
                onReject={handleReject}
                showDetails={true}
              />
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div>
            <h5>My Profile</h5>
            <ProfileSection
              lawyer={loggedLawyer}
              onSave={(updated) => {
                setLoggedLawyer(updated);
                localStorage.setItem("loggedInUser", JSON.stringify(updated));
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyerDashboard;
