import React, { useEffect, useState } from "react";

const EditModal = ({ isOpen, onClose, data, onSave }) => {
  // ✅ Hook luôn nằm ở đầu component
  const [formData, setFormData] = useState(data || {});

  // ✅ Khi "data" thay đổi (khi mở modal mới), cập nhật form
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  if (!isOpen) return null; // 👉 Đặt sau useState là ổn

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Edit {data?.type === "lawyers" ? "Lawyer" : "Customer"} Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {data?.type === "lawyers" && (
            <>
              <div>
                <label className="block text-gray-600 mb-1">Experience (years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  name="rating"
                  value={formData.rating || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
