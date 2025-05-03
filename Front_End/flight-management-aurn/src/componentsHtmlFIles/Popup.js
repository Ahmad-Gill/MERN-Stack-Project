import React from "react";

// Import success and error icons
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Popup = ({ message, type, onClose }) => {
  // Check if dark mode is enabled
  const isDarkMode = document.body.classList.contains("dark-mode");

  return (
    <div 
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: isDarkMode ? "#1e1e1e" : "white",
      color: isDarkMode ? "white" : "black",
      padding: "20px",
      boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
      zIndex: 1000000000000, // Use a large but realistic value
      borderRadius: "10px",
      textAlign: "center",
      width: "300px",
      border: isDarkMode ? "1px solid #444" : "none" // Fix: Added missing comma before border
    }}
    
    >
      {/* Show icon based on type */}
      {type === "success" ? (
        <FaCheckCircle size={40} color="green" />
      ) : (
        <FaTimesCircle size={40} color="red" />
      )}

      <p style={{ marginTop: "10px" }}>{message}</p>
      <button 
        onClick={onClose} 
        style={{ 
          marginTop: "10px", 
          padding: "8px 15px", 
          border: "none", 
          backgroundColor: isDarkMode ? "darkblue" : "darkblue", // Adjust button color for dark mode
          color: "white", 
          borderRadius: "5px", 
          cursor: "pointer" 
        }}
      >
        Close
      </button>
    </div>
  );
};

export default Popup;
