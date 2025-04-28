import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faTimes, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useRef, useEffect } from "react";
import Popup from "../componentsHtmlFIles/Popup";
import "../componentCssFiles/SupportChat.scss";
import { useSelector, useDispatch } from "react-redux";

const SupportChat = () => {
  const dispatch = useDispatch();
  const { isActive } = useSelector((state) => state.user);
  const email = useSelector((state) => state.user.email);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);

  const chatBodyRef = useRef(null);

  const toggleChat = async () => {
    if (!isActive) {
      setPopupMessage("Please log in first!");
      setPopupType("error");
      return;
    }

    setIsOpen(!isOpen);

    if (!isOpen && email) {
      try {
        const response = await fetch(`http://localhost:5000/chat/messages/${email}`);
        const data = await response.json();
        if (data.messages) {
          const loadedMessages = data.messages.map((msg) => ({
            text: msg.text,
            sender: msg.type === 'original' ? 'user' : 'support',  // ✅ Correctly identify sender
          }));
          setMessages(loadedMessages);
          scrollToBottom();
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    }
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    if (!email) {
      setPopupMessage("User email not found. Please log in again.");
      setPopupType("error");
      return;
    }

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    scrollToBottom();

    try {
      const response = await fetch(`http://localhost:5000/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          message: input,
          type: "original",
        }),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (response.ok) {
        // Add server response as support message
        const responseMessage = { text: data.responseText, sender: 'support' };
        setMessages((prevMessages) => [...prevMessages, responseMessage]);
        scrollToBottom();
      } else {
        setPopupMessage(data.message || "Failed to send message.");
        setPopupType("error");
      }

    } catch (error) {
      console.error("Error sending message:", error);
      setPopupMessage("Error connecting to server.");
      setPopupType("error");
    }
  };

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      {/* Floating Chat Icon */}
      <div className="chat-icon" onClick={toggleChat}>
        <FontAwesomeIcon icon={faMessage} size="lg" />
      </div>

      {/* Chat Popup Window */}
      {isOpen && (
        <div className="chat-popup">
          <div className="cta-button chat-header">
            <span className="chat-title">Chat</span>
            <FontAwesomeIcon icon={faTimes} className="close-btn" onClick={toggleChat} />
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'support-message'}`}
              >
                <div className="message-text">{msg.text}</div>
              </div>
            ))}
          </div>

          <div className="chat-footer">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="send-btn">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      )}

      {/* Popup for errors */}
      {popupMessage && (
        <Popup
          message={popupMessage}
          type={popupType}
          onClose={() => {
            setPopupMessage(null);
            setPopupType(null);
          }}
        />
      )}
    </>
  );
};

export default SupportChat;
