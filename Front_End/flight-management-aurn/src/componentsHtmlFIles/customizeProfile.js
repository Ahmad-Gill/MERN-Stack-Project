import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../componentCssFiles/customizeProfile.scss";
import { useSelector, useDispatch } from "react-redux";

import { useUser } from "../componentsHtmlFIles/UserContext";
import { updateUserProfile } from "../componentsHtmlFIles/customizeProfile_submit";
import Popup from "../componentsHtmlFIles/Popup";
import PlaneLoading from "../componentsHtmlFIles/PlaneLoading";

const CustomizeProfile = () => {
  const user = useSelector((state) => state.user); 
  const location = useLocation();
  const { updateProfileImage } = useUser();

  const email = location.state?.email || "No Email Provided";
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || "");
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [phoneError, setPhoneError] = useState(true);

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");

  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
  const fetchUserInfo = async () => {
    setIsLoading(true);
    let email = user.email;
    
    try {
      const response = await fetch(`http://localhost:5000/user?email=${encodeURIComponent(email)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); 
      const userData = data.user;
      if (userData) {
        setName(userData.username || "");
        setPhone(userData.phoneNumber || "");
        setAddress(userData.address || "");
        setDob(userData.dateOfBirth?.split("T")[0] || "");
        setGender(userData.gender || "");
        setCountry(userData.country || "");
        setLanguage(userData.preferredLanguage || "");
        setProfileImage(userData.image || "");
        setResponseMessage(data.message || "");
        localStorage.setItem("profileImage", userData.image || "");
      } else {
        setErrorMessage("User data not found.");
      }
    } catch (error) {
      setErrorMessage("Failed to fetch user data.");
      console.error("Error fetching user info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user.email !== "No Email Provided") {
    fetchUserInfo();
  }
}, [user.email]); 


  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const languageSet = new Set();
        const countryNames = [];

        data.forEach((country) => {
          if (country.name?.common) countryNames.push(country.name.common);
          if (country.languages) {
            Object.values(country.languages).forEach((lang) => languageSet.add(lang));
          }
        });

        setLanguages([...languageSet].sort());
        setCountries(countryNames.sort());
      })
      .catch((error) => console.error("Error fetching country/language data:", error));
  }, []);

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 15) {
      setPhoneError(true);
      setErrorMessage("Phone number cannot exceed 15 digits.");
    } else if (value.length < 10) {
      setPhoneError(true);
      setErrorMessage("Phone number must be at least 10 digits.");
    } else if (/^0+$/.test(value)) {
      setPhoneError(true);
      setErrorMessage("Phone number cannot be all zeros.");
    } else {
      setPhoneError(false);
      setErrorMessage("");
    }

    setPhone(value);
  };

  const handleAvatarSelect = (newImage) => {
    updateProfileImage(newImage);
    setProfileImage(newImage);
    localStorage.setItem("profileImage", newImage);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result;
      setProfileImage(imageData);
      updateProfileImage(imageData);
      localStorage.setItem("profileImage", imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userData = {
      email:user.email,                          
      image: profileImage,               
      username: name,                     
      phoneNumber: phone,                 
      address,                           
      dateOfBirth: new Date(dob),                  
      gender,                          
      country,                           
      preferredLanguage: language       
    };
    

    try {
      const response = await updateUserProfile(userData);

      setTimeout(() => {
        if (response.success) {
          setPopupMessage(response.message);
          setPopupType("success");
        } else {
          setPopupMessage(response.message || "Something went wrong.");
          setPopupType("error");
        }
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setTimeout(() => {
        setPopupMessage("An error occurred while updating profile.");
        setPopupType("error");
        setLoading(false);
      }, 2000);
    }
  };
  
  return  (
    <>
   
     {isLoading && <PlaneLoading isLoading={isLoading} />}         
<div className="profile-container">
      <h1> Customize Your Profile </h1>
      <div className="row">
        <div className="col-md-12">
          <div className="image-preview">
            {profileImage ? (
              <img src={profileImage} alt="Profile" />
            ) : avatar ? (
              <img src={avatar} alt="Avatar" />
            ) : (
              <p>No Image Selected</p>
            )}
         
            <label htmlFor="fileInput" className="upload-icon">
              <i className="fas fa-camera"></i>
            </label>
            <input id="fileInput" type="file" accept="image/*" onChange={handleImageUpload} hidden />
          </div>
        </div>
    <div className="row">
        <div className="col-md-12 avatar-selection">
          <h6>Or Choose an Avatar</h6>
          <div className="avatar-scroll">
            {[...Array(45)].map((_, index) => (
              <img 
                key={index} 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Avatar${index + 1}`} 
                alt={`Avatar ${index + 1}`} 
                onClick={() => handleAvatarSelect(`https://api.dicebear.com/7.x/avataaars/svg?seed=Avatar${index + 1}`)} 
                loading="lazy" 
              />

            ))}
          </div>
        </div>
      </div>
      </div>
  
  
      <form onSubmit={handleSubmit} className="profile-form">
      <div className="container mt-3">
  <div className="row">
    
    <div className="col-md-6 col-sm-12 mb-3">
      <label className="form-label">Email (Not Editable)</label>
      <input type="email" className="form-control" value={email} disabled />
    </div>
    <div className="col-md-6 col-sm-12 mb-3">
      <label className="form-label">Full Name</label>
      <input  type="text"  className="form-control"  value={name}  onChange={(e) => setName(e.target.value)}  placeholder="Enter full name"  required  />
    </div>
  </div>
</div>

  
<div className="container mt-3">
  <div className="row">
    <div className="col-md-6 col-sm-12 mb-3">
      <label className="form-label">Phone Number</label>
      <input type="tel" className="form-control" value={phone} onChange={handlePhoneChange} placeholder="Enter phone number" required
        style={{
          borderColor: phoneError ? "red" : "", 
          outline: phoneError ? "1px solid red" : "", 
        }}
      />
      {phoneError && <div style={{ color: "red", marginTop: "5px" }}>{errorMessage}</div>}
    </div>
    <div className="col-md-6 col-sm-12 mb-3">
      <label className="form-label">Address</label>
      <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter address" required />
    </div>
  </div>
</div>

  
<div className="container mt-3">
  <div className="row">
    <div className="col-md-6 col-sm-12 mb-3">
      <label className="form-label">Date of Birth</label>
      <input  type="date"  className="form-control"  value={dob}  onChange={(e) => setDob(e.target.value)}  required />
    </div>
    <div className="col-md-6 col-sm-12 mb-3">
      <label className="form-label">Gender</label>
      <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)} required>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>
  </div>
</div>
<div className="container mt-3">
  <div className="row">
    <div className="col-md-6 col-sm-12 mb-3">
      <label className="form-label">Country</label>
      <select
        className="form-control"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        required
      >
        <option value="">Select a country</option>
        {countries.map((c, index) => (
          <option key={index} value={c}>{c}</option>
        ))}
      </select>
    </div>
    <div className="col-md-6 col-sm-12 mb-3">
      <label className="form-label">Preferred Language</label>
      <select
        className="form-control"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        required
      >
        <option value="">Select Language</option>
        {languages.length > 0 ? (
          languages.map((lang, index) => (
            <option key={index} value={lang}>{lang}</option>
          ))
        ) : (
          <option disabled>Loading languages...</option>
        )}
      </select>
    </div>
  </div>
</div>

  



  
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



        <button type="submit"disabled={phoneError} className="profile-form__button">Save Changes</button>
      </form>
    </div>
  
    </>
  );
  
 
};






export default CustomizeProfile;
