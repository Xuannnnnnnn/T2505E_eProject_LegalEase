import React, { useState, useEffect } from "react";
import { FaEdit, FaCheck } from "react-icons/fa";
import categoriesData from "../data/categories.json";

const API_BASE = "http://localhost:3001";

const LawyerProfilePage = () => {
  const [avatar, setAvatar] = useState(null);
  const [categories, setCategories] = useState([]);
  const [lawyerInfo, setLawyerInfo] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Lấy dữ liệu categories (lĩnh vực)
  useEffect(() => {
    if (categoriesData) setCategories(categoriesData);
  }, []);

  // ✅ Lấy thông tin luật sư đăng nhập
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const role = localStorage.getItem("userRole");

    if (!storedUser || role !== "lawyer") {
      alert("Please log in as a lawyer.");
      window.location.href = "/login";
      return;
    }

    const id = storedUser.lawyer_id || storedUser.id;

    fetch(`${API_BASE}/lawyers/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch lawyer info");
        return res.json();
      })
      .then((data) => {
        setLawyerInfo(data);
        setAvatar(data.image);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load lawyer profile");
        setLoading(false);
      });
  }, []);

  // ✅ Upload & crop avatar (giữ nguyên logic crop tròn)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 270;
        const ctx = canvas.getContext("2d");
        canvas.width = size;
        canvas.height = size;

        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;

        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

        const roundedImage = canvas.toDataURL("image/png");
        setAvatar(roundedImage);
        // Lưu avatar tạm thời
        handleSaveField("image", roundedImage);
      };
    };
    reader.readAsDataURL(file);
  };

  // ✅ Khi nhấn biểu tượng bút
  const handleEdit = (field, value) => {
    setEditingField(field);
    setEditValue(value);
  };

  // ✅ Khi lưu từng trường
  const handleSave = () => {
    handleSaveField(editingField, editValue);
  };

  const handleSaveField = async (field, value) => {
    if (!lawyerInfo) return;
    const updated = { ...lawyerInfo, [field]: value };

    try {
      const res = await fetch(`${API_BASE}/lawyers/${lawyerInfo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Failed to save field");

      const saved = await res.json();
      setLawyerInfo(saved);
      localStorage.setItem("loggedInUser", JSON.stringify(saved)); // cập nhật localStorage
      setEditingField(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile field");
    }
  };

  if (loading || !lawyerInfo)
    return <div className="text-center mt-5 text-secondary">Loading profile...</div>;

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      {/* Avatar */}
      <div style={{ display: "inline-block", position: "relative" }}>
        <img
          src={avatar || "https://cdn-icons-png.flaticon.com/512/1946/1946429.png"}
          alt="Avatar"
          style={{
            width: "270px",
            height: "270px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #ddd",
            display: "block",
            margin: "0 auto",
          }}
        />
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
      </div>

      <h2 style={{ marginTop: "20px", fontWeight: "bold" }}>{lawyerInfo.name}</h2>
      <p style={{ color: "gray" }}>{lawyerInfo.city}</p>

      <h3
        style={{
          marginTop: "20px",
          borderBottom: "2px solid #eee",
          display: "inline-block",
          paddingBottom: "5px",
        }}
      >
        Basic Information
      </h3>

      {/* Info Section */}
      <div style={{ maxWidth: "600px", margin: "20px auto", textAlign: "left" }}>
        {[
          { label: "Full Name", field: "name" },
          { label: "Date of Birth", field: "dob" },
          { label: "Gender", field: "gender" },
          { label: "Email", field: "email" },
          { label: "Phone Number", field: "phone" },
          { label: "Address", field: "address" },
          { label: "City", field: "city" },
          { label: "Experience (years)", field: "experience_years" },
          { label: "Profile Summary", field: "profile_summary" },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #eee",
              padding: "10px 0",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: "600", flex: 1 }}>{item.label}</span>
            <div style={{ flex: 2, textAlign: "right" }}>
              {editingField === item.field ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "6px",
                  }}
                >
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                    autoFocus
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      padding: "4px 8px",
                      width: "70%",
                      fontSize: "14px",
                    }}
                  />
                  <FaCheck
                    style={{ cursor: "pointer", color: "green" }}
                    onClick={handleSave}
                  />
                </div>
              ) : (
                <span style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                  {lawyerInfo[item.field] || "-"}
                  <FaEdit
                    style={{
                      marginLeft: "8px",
                      cursor: "pointer",
                      color: "#007bff",
                    }}
                    onClick={() => handleEdit(item.field, lawyerInfo[item.field])}
                  />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LawyerProfilePage;
