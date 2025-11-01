import React from "react";

function ProfileField({ label, value, onChange, type = "text", disabled }) {
  return (
    <div className="flex flex-col mb-4">
      <label className="text-gray-600 text-sm mb-1">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`border border-gray-300 rounded-lg px-3 py-2 ${
          disabled
            ? "bg-gray-100 cursor-not-allowed"
            : "focus:outline-none focus:ring-2 focus:ring-blue-400"
        }`}
      />
    </div>
  );
}

export default ProfileField;
