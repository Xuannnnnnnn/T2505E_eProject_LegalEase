import React, { useState } from "react";
import notificationsData from "../data/notificationsData";

const LawyerNotificationsPage = () => {
  const [notifications, setNotifications] = useState(notificationsData.lawyers);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-3/5 bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center border-b pb-2">Lawyer Notifications</h2>

        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 border-b hover:bg-gray-50 transition-all rounded-lg flex justify-between items-start ${
              notif.read ? "opacity-70" : "bg-green-50"
            }`}
          >
            <div>
              <h3 className="font-semibold text-lg">{notif.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
              <span className="text-xs text-gray-400 mt-2 block">{notif.time}</span>
            </div>
            {!notif.read && (
              <button
                onClick={() => markAsRead(notif.id)}
                className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
              >
                Mark as read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LawyerNotificationsPage;
