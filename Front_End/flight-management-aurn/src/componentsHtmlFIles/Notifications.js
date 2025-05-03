import React, { useEffect, useState } from "react";

function Notifications({ email }) {
  console.log("notification for this email i ", email);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/upcoming-events?email=${email}`);
        const data = await response.json();
        console.log(data);

        // If the API returns success and events
        if (data.success && data.events) {
          // Transform the events into the desired format
          const transformedData = data.events.map(event => ({
            message: event.title,  // Using the event's title as the message
            timestamp: new Date(event.testDate).getTime() // Converting testDate to timestamp
          }));

          // Sort notifications by timestamp (most recent first)
          const sortedData = transformedData.sort((a, b) => b.timestamp - a.timestamp);
          setNotifications(sortedData);
        } else {
          console.error("No events found or unsuccessful response");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [email]); // Adding `email` as a dependency to refetch when the email changes

  return (
    <div className="notification-panel">
      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div key={index} className="notification-item">
            <p className="notification-message">
              <strong>{notification.message}</strong>
            </p>
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
