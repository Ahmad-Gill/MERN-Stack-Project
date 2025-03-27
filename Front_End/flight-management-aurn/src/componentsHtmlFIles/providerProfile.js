import { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../componentCssFiles/customizeProfile.scss";
import { useUser } from "../componentsHtmlFIles/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { updateUserProfile } from "../componentsHtmlFIles/customizeProfile_submit"; 
import Popup from "../componentsHtmlFIles/Popup";
import PlaneLoading from "../componentsHtmlFIles/PlaneLoading";   // for ANimation

const ProviderProfile = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);    // set isLoading for animation
  const [popupType, setPopupType] = useState(null);
  const [data, setData] = useState(null);
  const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);
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
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [languages, setLanguages] = useState([]);
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [phoneError, setPhoneError] = useState(true);
  const [bankName, setBankName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const languageSet = new Set();
        data.forEach((country) => {
          if (country.languages) {
            Object.values(country.languages).forEach((lang) => languageSet.add(lang));
          }
        });
        setLanguages([...languageSet].sort());
      })
      .catch((error) => console.error("Error fetching languages:", error));
  }, []);
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const countryNames = data
          .filter((c) => c.name && c.name.common)
          .map((c) => c.name.common)
          .sort(); 
        setCountries(countryNames);
      })
      .catch((error) => console.error("Error fetching countries:", error));
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
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setProfileImage(imageData);
        updateProfileImage(imageData);
        localStorage.setItem("profileImage", imageData);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loading animation // Simulate data fetching 
  
    const userData = {
      email, profileImage, name, phone, address, dob, gender, country, language, paymentMethod,
      cardDetails: paymentMethod === "card" ? { cardNumber, expiryDate, cvv } : null,
      paypalDetails: paymentMethod === "paypal" ? { paypalEmail } : null,
      bankDetails: paymentMethod === "bank" ? { bankName, accountNumber, swiftCode } : null,
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
   
     {isLoading && <PlaneLoading isLoading={isLoading} />}         {/* For ANimation */}
<div className="profile-container">
      <h1> Customize Your Profile as Provider</h1>
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
            {/* Upload Icon */}
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
  
      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="profile-form">
      <div className="container mt-3">
  <div className="row">
    {/* Email Field */}
    <div className="col-md-6 col-sm-12 mb-3">
      <label className="form-label">Email (Not Editable)</label>
      <input type="email" className="form-control" value={email} disabled />
    </div>

    {/* Full Name Field */}
    <div className="col-md-6 col-sm-12 mb-3">
      <label className="form-label">Full Name</label>
      <input  type="text"  className="form-control"  value={name}  onChange={(e) => setName(e.target.value)}  placeholder="Enter full name"  required  />
    </div>
  </div>
</div>

  
<div className="container mt-3">
  <div className="row">
    {/* Phone Number Field */}
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


    {/* Address Field */}
    <div className="col-md-6 col-sm-12 mb-3">
      <label className="form-label">Address</label>
      <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter address" required />
    </div>
  </div>
</div>

  
<div className="container mt-3">
  <div className="row">
    {/* Date of Birth Field */}
    <div className="col-md-6 col-sm-12 mb-3">
      <label className="form-label">Date of Birth</label>
      <input  type="date"  className="form-control"  value={dob}  onChange={(e) => setDob(e.target.value)}  required />
    </div>

    {/* Gender Field */}
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
    {/* Country Field */}
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

    {/* Preferred Language Field */}
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

  
        {/* Payment Information */}
        <h3 className="profile-form__section-title">Payment Information</h3>

<div className="container mt-3">
  {/* Payment Method Selection */}
  <div className="row">
    <div className="col-md-12 col-sm-12 mb-3">
      <label className="form-label">Select Payment Method</label>
      <select 
        className="form-control" 
        value={paymentMethod} 
        onChange={(e) => setPaymentMethod(e.target.value)} 
        required
      >
        <option value="">Choose Payment Method</option>
        <option value="card">Credit/Debit Card</option>
        <option value="paypal">PayPal</option>
        <option value="bank">Bank Transfer</option>
      </select>
    </div>
  </div>

  {/* Credit/Debit Card Section */}
  {paymentMethod === "card" && (
    <>
      <div className="row">
        <div className="col-md-12 col-sm-12 mb-3">
          <label className="form-label">Card Number</label>
          <input type="text" className="form-control"value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Enter card number" required  maxLength="16"  />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-sm-12 mb-3">
          <label className="form-label">Expiry Date</label>
          <input type="month" className="form-control" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
        </div>

        <div className="col-md-6 col-sm-12 mb-3">
          <label className="form-label">CVV</label>
          <input type="password" className="form-control" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="Enter CVV" required maxLength="3"  />
        </div>
      </div>
    </>
  )}

  {/* PayPal Section */}
  {paymentMethod === "paypal" && (
    <div className="row">
      <div className="col-md-12 col-sm-12 mb-3">
        <label className="form-label">PayPal Email</label>
        <input type="email" className="form-control" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)} placeholder="Enter PayPal email" required />
      </div>
    </div>
  )}

  {/* Bank Transfer Section */}
  {paymentMethod === "bank" && (
    <>
      <div className="row">
        <div className="col-md-12 col-sm-12 mb-3">
          <label className="form-label">Bank Name</label>
          <input  type="text"  className="form-control"  value={bankName}  onChange={(e) => setBankName(e.target.value)}  placeholder="Enter bank name"  required  />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-sm-12 mb-3">
          <label className="form-label">Account Number</label>
          <input type="text" className="form-control" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Enter account number" required/>
        </div>

        <div className="col-md-6 col-sm-12 mb-3">
          <label className="form-label">SWIFT Code</label>
          <input  type="text"  className="form-control"  value={swiftCode}  onChange={(e) => setSwiftCode(e.target.value)}  placeholder="Enter SWIFT code"  required 
          />
        </div>
      </div>
    </>
  )}
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


export default ProviderProfile;
