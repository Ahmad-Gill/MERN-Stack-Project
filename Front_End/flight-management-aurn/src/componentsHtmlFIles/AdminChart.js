import React, { useState, useEffect } from "react";
import "../componentCssFiles/AdminChart.scss";
import { useSelector, useDispatch } from "react-redux";

const AdminChart = () => {
  const name = useSelector((state) => state.user.name);
  const [users, setUsers] = useState([]);  
  const [selectedUser, setSelectedUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/user/users");
        const data = await response.json();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          throw new Error("Fetched data is not an array");
        }
        setError(null); 
      } catch (error) {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchMessages = async (email) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/chat/messages/${email}`);
      const data = await response.json();
      setMessages(data.messages || []);
      setError(null);
    } catch (error) {
      setError("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (e) => {
    const email = e.target.value;
    setSelectedUser(email);
    fetchMessages(email);
  };

  const handleMessageChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) {
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
          type: "response",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "response", text: messageInput },
        ]);
        setMessageInput("");
        fetchMessages(selectedUser)
      } else {
        setMessageInput("");
        fetchMessages(selectedUser)
      }
    } catch (error) {
      alert("Error sending message.");
    }
  };

  return (
    <div className="admin-chart">
      <h1>Admin Chat Section</h1>

      <div className="select-user-container">
        <label>Select User:</label>
        <select value={selectedUser} onChange={handleUserChange}>
          <option value="">-- Select a User --</option>
          {users.length > 0 ? (
            users.map((user) => (
              <option key={user._id} value={user.email}>
                {user.email}
              </option>
            ))
          ) : (
            <option disabled>No users available</option>
          )}
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {selectedUser && !loading && (
        <div>
          <h3>Messages with {selectedUser}</h3>
          <div className="messages">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.type === "response" ? "admin-response" : "user-message"}`}
                >
                  <strong>{msg.type === "response" ? name : selectedUser}</strong>
                  {msg.text}
                </div>
              ))
            ) : (
              <p>No messages yet.</p>
            )}
          </div>

          <textarea
            value={messageInput}
            onChange={handleMessageChange}
            placeholder="Type a message..."
          />
          <button class="clickme" onClick={handleSendMessage} disabled={!messageInput.trim()}>
            Send Message
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminChart;
