import React, { useState, useEffect } from "react";
import { FaEdit, FaCheck } from "react-icons/fa";
import categoriesData from "../data/categories.json"; // Đảm bảo file này tồn tại

const LawyerProfilePage = () => {
  const [avatar, setAvatar] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, []);

  // Initial data
  const [lawyerInfo, setLawyerInfo] = useState({
    fullName: "John Doe",
    specialization: "Civil Law",
    birthday: "1985-07-20",
    email: "john.doe@example.com",
    phone: "0123 456 789",
    address: "District 1, Ho Chi Minh City",
  });

  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Upload & crop avatar
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const size = 270; // enlarged 1.5x (original 180)
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
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // Edit handlers
  const handleEdit = (field, value) => {
    setEditingField(field);
    setEditValue(value);
  };

  const handleSave = () => {
    setLawyerInfo((prev) => ({
      ...prev,
      [editingField]: editValue,
    }));
    setEditingField(null);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      {/* Avatar */}
      <div style={{ display: "inline-block", position: "relative" }}>
        <img
          src={
            avatar || "https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
          }
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
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ fontSize: "14px" }}
          />
        </div>
      </div>

      {/* Name & specialization */}
      <h2 style={{ marginTop: "20px", fontWeight: "bold" }}>
        {lawyerInfo.fullName}
      </h2>
      <p style={{ color: "gray" }}>{lawyerInfo.specialization}</p>

      {/* Title */}
      <h3
        style={{
          marginTop: "20px",
          borderBottom: "2px solid #eee",
          display: "inline-block",
          paddingBottom: "5px",
          textAlign: "center",
        }}
      >
        Basic Information
      </h3>

      {/* Info section */}
      <div
        style={{
          maxWidth: "600px",
          margin: "20px auto",
          textAlign: "left",
        }}
      >
        {[
          { label: "Full Name", field: "fullName" },
          { label: "Specialization", field: "specialization" },
          { label: "Date of Birth", field: "birthday" },
          { label: "Email", field: "email" },
          { label: "Phone Number", field: "phone" },
          { label: "Address", field: "address" },
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
            <span style={{ fontWeight: "600", flex: 1, textAlign: "left" }}>
              {item.label}
            </span>

            <div style={{ flex: 2, textAlign: "right" }}>
              {editingField === item.field ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    justifyContent: "flex-end",
                  }}
                >
                  {item.field === "specialization" ? (
                    <select
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleSave}
                      autoFocus
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        padding: "4px 8px",
                        width: "70%",
                        fontSize: "14px",
                      }}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  ) : (
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
                  )}
                  <FaCheck
                    style={{
                      cursor: "pointer",
                      color: "green",
                    }}
                    onClick={handleSave}
                  />
                </div>
              ) : (
                <span
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  {lawyerInfo[item.field]}
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
