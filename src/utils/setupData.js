// src/utils/setupData.js
import lawyers from "../data/lawyers.json";
import customers from "../data/customers.json";

export const setupData = () => {
  // Xóa dữ liệu cũ
  localStorage.removeItem("lawyers");
  localStorage.removeItem("customers");
  // Luật sư: giữ nguyên email từ JSON, thêm password mặc định
  const lawyersWithLogin = lawyers.map((l) => ({
    ...l,
    email: l.email || `lawyer${l.lawyer_id || Math.random()}@gmail.com`,
    password: "123456",
  }));

  // Khách hàng: giữ nguyên email từ JSON, thêm password mặc định
  const customersWithLogin = customers.map((c) => ({
    ...c,
    email: c.email || `customer${c.customer_id || Math.random()}@gmail.com`,
    password: "123456",
  }));

  // Lưu vào localStorage nếu chưa có
  if (!localStorage.getItem("lawyers")) {
    localStorage.setItem("lawyers", JSON.stringify(lawyersWithLogin));
  }
  if (!localStorage.getItem("customers")) {
    localStorage.setItem("customers", JSON.stringify(customersWithLogin));
  }

  console.log("Setup data completed!");
};
