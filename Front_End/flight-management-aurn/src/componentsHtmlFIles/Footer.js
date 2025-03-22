import React, { useState } from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"; 
import "../componentCssFiles/footer.scss"; 
import Popup from "../componentsHtmlFIles/Popup";

function Footer() {
  const [email, setEmail] = useState("");
  const [popupMessage, setPopupMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [popupType, setPopupType] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPopupMessage(""); 
    setPopupType(""); 
    setLoading(true); 

    setTimeout(() => {
        setLoading(false); 
        setPopupMessage(`Thank you! We will keep in touch at: ${email}`);
        setPopupType("success");
        setEmail(""); 
    }, 2000); 
};



  return (
    <>
    <footer className="footer">
      <div className="footerContainer">
        {/* Left - Social Links */}
        <div className="socialSection">
          <div className="socialLinks">
            <a href="https://github.com/Ahmad-Gill/Ahmad-Gill" target="_blank" rel="noopener noreferrer">
              <FaGithub className="icon" /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/muhammad-ahmad-gill-427772262/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="icon" /> LinkedIn
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="icon" /> Twitter
            </a>
          </div>
        </div>

        {/* Center - Keep in Touch Section */}
        <div className="keepInTouch">
          <h3>Keep in Touch</h3>
          <form onSubmit={handleSubmit} className="emailForm">
            <input  type="email" placeholder="Enter your email"  value={email}  onChange={(e) => setEmail(e.target.value)}  required  className="emailInput"/>
            
            
            {/* POP UP MESSAGE  */}
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
            <button type="submit" className="submitButton">Subscribe</button>
          </form>
        </div>

        {/* Right - Google Map */}
        <div className="mapContainer">
          <iframe
            title="Office Location"
            className="googleMap"
           src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3402.551512089543!2d74.3030141!3d31.4815212!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391903f08ebc7e8b%3A0x47e934f4cd34790!2sFAST%20NUCES%20Lahore!5e0!3m2!1sen!2s!4v1742670338145!5m2!1sen!2s"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Copyright at Center & Bottom */}
      <p className="footerCopyright">© 2025 Muhammad Ahmad Gill. All Rights Reserved.</p>
    </footer>


{/* LOOOODING */}
{loading && (
  <div className="loading-overlay">
    <div className="spinner"></div>
  </div>
)}
</>
  );
}

export default Footer;
