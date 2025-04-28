import React, { useState, useEffect } from "react";
import "../componentCssFiles/AdminChart.scss";

const AdminChart = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  // Fetch list of users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/user");
        const data = await response.json();
        setUsers(data); // Keep full user objects
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch messages for the selected user
  const fetchMessages = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/chat/messages/${email}`);
      const data = await response.json();
      setMessages(data.messages); // Assuming the response contains an array of messages
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Handle user selection
  const handleUserChange = (e) => {
    const email = e.target.value;
    setSelectedUser(email);
    fetchMessages(email); // Fetch messages for selected user
  };

  // Handle message input change
  const handleMessageChange = (e) => {
    setMessageInput(e.target.value);
  };

  // Handle message submission
  const handleSendMessage = async () => {
    if (!messageInput.trim()) {
      alert("Please enter a message.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: selectedUser,
          message: messageInput,
          type: "response", // This will mark the message as a response
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        // After sending, fetch the updated messages again
        fetchMessages(selectedUser); // Fetch the new list of messages
        setMessageInput(""); // Clear the message input
      } else {
        fetchMessages(selectedUser);
        setMessageInput("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message.");
    }
  };
  

  return (
    <div className="admin-chart">
      <h1>Admin Chat Section</h1>

      {/* Dropdown to select a user */}
      <div>
        <label>Select User:</label>
        <select value={selectedUser} onChange={handleUserChange}>
          <option value="">-- Select a User --</option>
          {users.map((user) => (
            <option key={user._id} value={user.email}>
              {user.email}
            </option>
          ))}
        </select>
      </div>

      {/* Display messages if a user is selected */}
      {selectedUser && (
        <div>
          <h3>Messages with {selectedUser}</h3>
          <div className="messages">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.type === "response" ? "admin-response" : "user-message"}`}
                >
                  <strong>{msg.type === "response" ? "Admin" : "User"}:</strong>
                  {msg.text || msg} {/* Handle if msg is an object */}
                </div>
              ))
            ) : (
              <p>No messages yet.</p>
            )}
          </div>

          {/* Message input and send button */}
          <div>
            <textarea
              value={messageInput}
              onChange={handleMessageChange}
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send Message</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChart;
