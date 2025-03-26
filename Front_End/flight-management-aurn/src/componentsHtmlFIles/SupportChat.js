import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useRef, useEffect } from "react";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Popup from "../componentsHtmlFIles/Popup";

import "../componentCssFiles/SupportChat.scss";




import { useSelector, useDispatch } from "react-redux";
import { setName, setEmail, setActiveStatus, setCustomerStatus, setProviderStatus, resetUser } from "../store";

const SupportChat = () => {
      const [popupType, setPopupType] = useState(null);
      const [popupMessage, setPopupMessage] = useState(null);
    const user = useSelector((state) => state.user);       //REdux comands
    const { isActive, isCustomer, isProvider } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBodyRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    // Auto-scroll to the latest message
    setTimeout(scrollToBottom, 100);

    try {
        // Simulating an API response instead of calling an actual API
        setTimeout(() => {
            const dummyResponse = { reply: "This is a dummy bot response." };
            setMessages([...newMessages, { text: dummyResponse.reply, sender: "bot" }]);
            scrollToBottom();
        }, 1000); // Simulating network delay

        /*
        // Uncomment this to send a real API request
        const response = await fetch("https://your-api-endpoint.com/sendMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: input }),
        });

        const data = await response.json();
        setMessages([...newMessages, { text: data.reply, sender: "bot" }]);
        scrollToBottom();
        */
    } catch (error) {
        console.error("Error sending message:", error);
    }
};

// Function to scroll down to the latest message
const scrollToBottom = () => {
    if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
};

// Auto-scroll when messages update
useEffect(() => {
    scrollToBottom();
}, [messages]);


  return (
    <>
      {/* Floating Chat Icon */}
      <div
  className="chat-icon"
  onClick={() => {
    if (!isActive) {
      setPopupMessage("Please log in first!");
      setPopupType("error");
    } else {
      toggleChat();
    }
  }}
>
  <FontAwesomeIcon icon={faMessage} size="1.9x" />
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
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="send-btn">
    <FontAwesomeIcon icon={faPaperPlane} />
</button>

          </div>
        </div>
      )}


       {/*--------------------------------- POP up message ---------------- */}
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
