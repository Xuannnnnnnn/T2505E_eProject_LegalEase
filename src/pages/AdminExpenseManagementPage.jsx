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

const BASE_URL = "http://localhost:3001";

const AdminExpenseManagementPage = () => {
  const [startDate, setStartDate] = useState("2025-10-01");
  const [endDate, setEndDate] = useState("2025-10-31");
  const [filterType, setFilterType] = useState("income"); // income | commission
  const [lawyers, setLawyers] = useState([]);
  const [incomeDetails, setIncomeDetails] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [editMode, setEditMode] = useState(null);

  // Fetch lawyers & fees data from db.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        const lawyerRes = await fetch(`${BASE_URL}/lawyers`);
        const lawyerData = await lawyerRes.json();
        setLawyers(
          lawyerData.map((l) => ({
            id: l.id,
            name: l.name,
            hourlyRate: l.hourly_rate || 0,
            commission: l.commission || 0,
            discount_2_3h: l.discount_2_3h || 0,
            discount_3h: l.discount_3h || 0,
          }))
        );

        // Assume you have a table "appointments" to calculate income
        const appointmentsRes = await fetch(`${BASE_URL}/appointments`);
        const appointments = await appointmentsRes.json();

        const income = lawyerData.map((lawyer) => {
          const lawyerAppointments = appointments.filter(
            (a) => a.lawyer_id === lawyer.id
          );
          const hours = lawyerAppointments.reduce(
            (sum, a) => sum + (a.duration_minutes / 60 || 0),
            0
          );
          const revenue = hours * (lawyer.hourly_rate || 0);
          const commission = (lawyer.commission || 0) / 100 * revenue;
          const lawyerIncome = revenue - commission;
          return {
            lawyer: lawyer.name,
            hours: Math.round(hours),
            appointments: lawyerAppointments.length,
            revenue,
            commission,
            lawyerIncome,
          };
        });

        setIncomeDetails(income);

        // Dummy chart data, you can replace with real weekly/monthly aggregation
        setChartData([
          { name: "Week 1", value: 800 },
          { name: "Week 2", value: 1200 },
          { name: "Week 3", value: 1000 },
          { name: "Week 4", value: 1500 },
        ]);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () =>
    alert(`Statistics from ${startDate} to ${endDate} (${filterType})`);

  const handleEdit = (id) => setEditMode(id);
  const handleSave = () => {
    alert("Changes saved!");
    setEditMode(null);
  };

  const handleChange = (id, field, value) => {
    setLawyers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const formatCurrency = (num) => `$${Math.round(num)}`;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        Lawyer Fees & Income Management
      </h2>

      {/* Filter Section */}
      <div className="bg-white p-5 rounded-xl shadow mb-6 flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <label className="text-sm font-semibold">Date Range:</label>
          <div className="flex items-center gap-3 whitespace-nowrap">
            <span className="text-sm">From</span>
            <input
              type="date"
              className="border rounded-md p-2 focus:ring focus:ring-blue-200"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-sm">To</span>
            <input
              type="date"
              className="border rounded-md p-2 focus:ring focus:ring-blue-200"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 mt-2">
            <label className="text-sm font-semibold">Statistic Type:</label>
            <select
              className="border rounded-md p-2 focus:ring focus:ring-blue-200"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="income">Total Income</option>
              <option value="commission">Commission</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-black font-semibold px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all w-fit mt-2"
          >
            🔍 Search
          </button>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-5 rounded-xl shadow mb-8">
        <h3 className="text-lg font-semibold mb-3 text-blue-600">
          {filterType === "income" ? "Income" : "Commission"} Statistics
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

      {/* Lawyers List */}
      <div className="bg-white p-5 rounded-xl shadow mb-8">
        <h3 className="text-lg font-semibold mb-3 text-blue-600">
          Lawyer List
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50 text-blue-700">
              <th className="border p-3 text-left">Lawyer Name</th>
              <th className="border p-3 text-left">Hourly Rate ($)</th>
              <th className="border p-3 text-left">Commission (%)</th>
              <th className="border p-3 text-left">Discount 2–3h (%)</th>
              <th className="border p-3 text-left">Discount &gt;3h (%)</th>
              <th className="border p-3 text-center">Actions</th>
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
                      onChange={(e) =>
                        handleChange(l.id, "hourlyRate", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleChange(l.id, "commission", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleChange(l.id, "discount_2_3h", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleChange(l.id, "discount_3h", e.target.value)
                      }
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

      {/* Income Details */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3 text-blue-600">
          Income Details
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50 text-blue-700">
              <th className="border p-3 text-left">Lawyer Name</th>
              <th className="border p-3 text-left">Completed Hours</th>
              <th className="border p-3 text-left">Appointments</th>
              <th className="border p-3 text-left">Total Revenue ($)</th>
              <th className="border p-3 text-left">Commission ($)</th>
              <th className="border p-3 text-left">Lawyer Income ($)</th>
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
