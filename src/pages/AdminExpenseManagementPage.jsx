import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AdminExpenseManagementPage = () => {
  const [startDate, setStartDate] = useState("2025-10-01");
  const [endDate, setEndDate] = useState("2025-10-31");
  const [filterType, setFilterType] = useState("income");
  const [lawyers, setLawyers] = useState([]);
  const [incomeDetails, setIncomeDetails] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    const lawyerData = [
      { id: 1, name: "Nguyễn Văn A", hourlyRate: 120, commission: 10, discount_2_3h: 5, discount_3h: 10 },
      { id: 2, name: "Trần Thị B", hourlyRate: 150, commission: 12, discount_2_3h: 7, discount_3h: 12 },
      { id: 3, name: "Lê Hoàng C", hourlyRate: 100, commission: 8, discount_2_3h: 4, discount_3h: 9 },
    ];

    const incomeData = [
      { lawyer: "Nguyễn Văn A", hours: 20, appointments: 5, revenue: 2400, commission: 240, lawyerIncome: 2160 },
      { lawyer: "Trần Thị B", hours: 25, appointments: 6, revenue: 3750, commission: 450, lawyerIncome: 3300 },
      { lawyer: "Lê Hoàng C", hours: 15, appointments: 3, revenue: 1500, commission: 120, lawyerIncome: 1380 },
    ];

    const chart = [
      { name: "Tuần 1", value: 800 },
      { name: "Tuần 2", value: 1200 },
      { name: "Tuần 3", value: 1000 },
      { name: "Tuần 4", value: 1500 },
    ];

    setLawyers(lawyerData);
    setIncomeDetails(incomeData);
    setChartData(chart);
  }, []);

  const handleSearch = () => alert(`Thống kê từ ${startDate} đến ${endDate} (${filterType})`);
  const handleEdit = (id) => setEditMode(id);
  const handleSave = () => {
    alert("Đã lưu thay đổi!");
    setEditMode(null); 
  };

  const handleChange = (id, field, value) => {
    setLawyers((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const formatCurrency = (num) => `$${Math.round(num)}`;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Quản lý chi phí & thu nhập luật sư</h2>

      {/* --- Bộ lọc thống kê --- */}
      <div className="bg-white p-5 rounded-xl shadow mb-6 flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <label className="text-sm font-semibold">Khoảng thời gian:</label>
          <br />
          <div className="flex items-center gap-3 whitespace-nowrap">
            <br />
            <span className="text-sm">Từ         </span>
            <input
              type="date"
              className="border rounded-md p-2 focus:ring focus:ring-blue-200"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-sm"> Đến  </span>
            <input
              type="date"
              className="border rounded-md p-2 focus:ring focus:ring-blue-200"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <br />
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold">Kiểu thống kê:</label>
            <br />
            <select
              className="border rounded-md p-2 focus:ring focus:ring-blue-200"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="income">Tổng thu nhập</option>
              <option value="commission">Hoa hồng</option>
            </select>
          </div>
          <br />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-black font-semibold px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all w-fit"
          >
            🔍 Tìm kiếm
          </button>
        </div>
      </div>

      {/* --- Biểu đồ --- */}
      <div className="bg-white p-5 rounded-xl shadow mb-8">
        <h3 className="text-lg font-semibold mb-3 text-blue-600">
          Biểu đồ thống kê {filterType === "income" ? "thu nhập" : "hoa hồng"}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Bar dataKey="value" fill="#3B82F6" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* --- Danh sách luật sư --- */}
      <div className="bg-white p-5 rounded-xl shadow mb-8">
        <h3 className="text-lg font-semibold mb-3 text-blue-600">Danh sách luật sư</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50 text-blue-700">
              <th className="border p-3 text-left">Tên luật sư</th>
              <th className="border p-3 text-left">Chi phí/giờ ($)</th>
              <th className="border p-3 text-left">Hoa hồng (%)</th>
              <th className="border p-3 text-left">Discount 2–3h (%)</th>
              <th className="border p-3 text-left">Discount &gt;3h (%)</th>
              <th className="border p-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {lawyers.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="border p-3">{l.name}</td>
                <td className="border p-3">
                  {editMode === l.id ? (
                    <input
                      type="number"
                      className="border rounded p-1 w-24"
                      value={l.hourlyRate}
                      onChange={(e) => handleChange(l.id, "hourlyRate", e.target.value)}
                    />
                  ) : (
                    `$${Math.round(l.hourlyRate)}`
                  )}
                </td>
                <td className="border p-3">
                  {editMode === l.id ? (
                    <input
                      type="number"
                      className="border rounded p-1 w-20"
                      value={l.commission}
                      onChange={(e) => handleChange(l.id, "commission", e.target.value)}
                    />
                  ) : (
                    `${Math.round(l.commission)}%`
                  )}
                </td>
                <td className="border p-3">
                  {editMode === l.id ? (
                    <input
                      type="number"
                      className="border rounded p-1 w-20"
                      value={l.discount_2_3h}
                      onChange={(e) => handleChange(l.id, "discount_2_3h", e.target.value)}
                    />
                  ) : (
                    `${Math.round(l.discount_2_3h)}%`
                  )}
                </td>
                <td className="border p-3">
                  {editMode === l.id ? (
                    <input
                      type="number"
                      className="border rounded p-1 w-20"
                      value={l.discount_3h}
                      onChange={(e) => handleChange(l.id, "discount_3h", e.target.value)}
                    />
                  ) : (
                    `${Math.round(l.discount_3h)}%`
                  )}
                </td>
                <td className="border p-3 text-center">
                  {editMode === l.id ? (
                    <button
                      onClick={handleSave}
                      className="bg-green-500 hover:bg-green-600 text-black px-3 py-1 rounded-md"
                    >
                      💾 Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(l.id)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-md"
                    >
                      ✏️ Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Chi tiết thu nhập --- */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3 text-blue-600">Chi tiết thu nhập</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50 text-blue-700">
              <th className="border p-3 text-left">Tên luật sư</th>
              <th className="border p-3 text-left">Số giờ hoàn thành</th>
              <th className="border p-3 text-left">Số cuộc hẹn</th>
              <th className="border p-3 text-left">Tổng doanh thu ($)</th>
              <th className="border p-3 text-left">Hoa hồng ($)</th>
              <th className="border p-3 text-left">Luật sư nhận ($)</th>
            </tr>
          </thead>
          <tbody>
            {incomeDetails.map((i, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border p-3">{i.lawyer}</td>
                <td className="border p-3">{i.hours}</td>
                <td className="border p-3">{i.appointments}</td>
                <td className="border p-3">{formatCurrency(i.revenue)}</td>
                <td className="border p-3">{formatCurrency(i.commission)}</td>
                <td className="border p-3">{formatCurrency(i.lawyerIncome)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminExpenseManagementPage;
