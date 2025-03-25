import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";


import "../componentCssFiles/SupportChat.scss"; // Ensure you create this CSS file

const SupportChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
  
    const toggleChat = () => {
      setIsOpen(!isOpen);
    };
  
    const sendMessage = () => {
      if (input.trim() !== "") {
        setMessages([...messages, { text: input, sender: "user" }]);
        setInput("");
      }
    };
  
    return (
      <>
        {/* Floating Chat Icon */}
        <div className="chat-icon" onClick={toggleChat}>
          <FontAwesomeIcon icon={faMessage} size="2x" />
        </div>
  
        {/* Chat Popup Window */}
        {isOpen && (
          <div className="chat-popup">
            <div className="chat-header">
              <span>Support Chat</span>
              <FontAwesomeIcon icon={faTimes} className="close-btn" onClick={toggleChat} />
            </div>
            <div className="chat-body">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="chat-footer">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}
      </>
    );
  };
  
  export default SupportChat;
