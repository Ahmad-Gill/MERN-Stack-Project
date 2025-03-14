import React, { useEffect, useState } from "react";

  function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchNotifications = async () => {
        try {
          // API Call (Commented for now)
          // const response = await fetch("https://your-api.com/notifications");
          // const data = await response.json();
  
          // Dummy Data for Now
          const data = [
            { message: "New message from John", timestamp: new Date("2025-03-14T14:32:00").getTime() },
            { message: "Your order has been shipped", timestamp: new Date("2025-03-14T12:00:00").getTime() },
            { message: "Reminder: Meeting at 3 PM", timestamp: new Date("2025-03-14T09:00:00").getTime() },
            { message: "System update available", timestamp: new Date("2025-03-13T10:15:00").getTime() },
            { message: "Your password will expire soon", timestamp: new Date("2025-03-12T08:30:00").getTime() },
            { message: "New comment on your post", timestamp: new Date("2025-03-14T14:35:00").getTime() },
            { message: "Alice liked your photo", timestamp: new Date("2025-03-14T14:27:00").getTime() },
            { message: "Upcoming event tomorrow", timestamp: new Date("2025-03-15T10:00:00").getTime() },
            { message: "Your report is ready for download", timestamp: new Date("2025-03-14T11:00:00").getTime() },
            { message: "Security alert: Unusual login attempt", timestamp: new Date("2025-03-14T14:02:00").getTime() },
          ];
  
          // Sort notifications by time (most recent first)
          const sortedData = data.sort((a, b) => b.timestamp - a.timestamp);
  
          setNotifications(sortedData);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchNotifications();
    }, []);
  return (
    <div className="notification-panel">
      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div key={index} className="notification-item">
            <p className="notification-message"><strong>{notification.message}</strong></p>
            <span className="notification-time">
              {new Date(notification.timestamp).toLocaleString()}
            </span>
          </div>
        ))
      ) : (
        <p>No new notifications</p>
      )}
    </div>

  );
}

export default Notifications;
