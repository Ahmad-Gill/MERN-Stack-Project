import { useState } from "react";
import { useLocation } from "react-router-dom";
import "../componentCssFiles/customizeProfile.scss";
import { useUser } from "../componentsHtmlFIles/UserContext";

const CustomizeProfile = () => {
  const location = useLocation();
  const email = location.state?.email || "No Email Provided";
  const { updateProfileImage } = useUser();
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || "");
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleAvatarSelect = (newImage) => {
    updateProfileImage(newImage); // Instantly updates across components
    setProfileImage(newImage); // Update the state
    localStorage.setItem("profileImage", newImage); // Save to localStorage for persistence
  };
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result; // Base64 image string
        setProfileImage(imageData);
        updateProfileImage(imageData); // Update profile image globally
        localStorage.setItem("profileImage", imageData); // Save to localStorage
      };
      reader.readAsDataURL(file);
    }
  };
  
  



  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile Updated Successfully!");
  };

  return (
    <div className="profile-container">
      <h1>Customize Your Profile</h1>

      {/* Profile Image Upload or Avatar Selection */}
      <div className="profile-image-section">
        <h3>Profile Picture</h3>
        <div className="image-preview">
          {profileImage ? (
            <img src={profileImage} alt="Profile" />
          ) : avatar ? (
            <img src={avatar} alt="Avatar" />
          ) : (
            <p>No Image Selected</p>
          )}
        </div>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <div className="avatar-selection">
  <h4>Or Choose an Avatar</h4>
  <div className="avatars">
    <div className="avatar-scroll">
      {[...Array(15)].map((_, index) => (
        <img 
          key={index} 
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Avatar${index + 1}`} 
          alt={`Avatar ${index + 1}`} 
          onClick={() => handleAvatarSelect(`https://api.dicebear.com/7.x/avataaars/svg?seed=Avatar${index + 1}`)} 
        />
      ))}
    </div>
  </div>
</div>

      </div>

      {/* General Information */}
      <form onSubmit={handleSubmit} className="profile-form">
        <label>Email (Not Editable)</label>
        <input type="email" value={email} disabled />

        <label>Full Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter full name" required />

        <label>Phone Number</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" required />

        <label>Address</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter address" required />

        {/* Credit/Debit Card Information */}
        <h3>Payment Information</h3>

        <label>Card Number</label>
        <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Enter card number" required maxLength="16" />

        <label>Expiry Date</label>
        <input type="month" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />

        <label>CVV</label>
        <input type="password" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="Enter CVV" required maxLength="3" />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default CustomizeProfile;
