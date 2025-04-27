import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../componentCssFiles/AuthContainer.scss";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Popup from "../componentsHtmlFIles/Popup";
import { useDispatch, useSelector } from "react-redux";
import {setName,setEmail,setActiveStatus,setCustomerStatus,setProviderStatus,} from "../store";  //Get Data from Store

function AuthPage() {
  const dispatch = useDispatch();  
  const { name, email, isActive } = useSelector((state) => state.user);  // Get Data from store 
  const navigate = useNavigate(); 
  const [isSignUp, setIsSignUp] = useState(false);
  const [popupType, setPopupType] = useState(null);  //Used for POP up messages 
  const [popupMessage, setPopupMessage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (window.innerWidth <= 768) {
      navigate("/LogIn");
    }
  }, [navigate]);

  const toggleMode = () => {
    setError(""); 
    setIsSignUp(!isSignUp);
  };

  const [logInData, setLogInData] = useState({
    password: "",
    email_id: "",
  });

  const [signUpData, setSignUpData] = useState({
    full_name: "",
    email: "",
    password: "",
    cnfrm_pass: "",
    prov_cus: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    if (isSignUp) {
      setSignUpData((prev) => ({ ...prev, [name]: value }));
    } else {
      setLogInData((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleSubmission(event) {
    event.preventDefault();
    setError("");

    if (isSignUp) {
      if (signUpData.password !== signUpData.cnfrm_pass) {
        setPopupMessage("Error: Password and Confirm Password should be the same.");
        setPopupType("error");
        setSignUpData((prev) => ({ ...prev, password: "", cnfrm_pass: "" }));
        return;
      }
      dispatch(setName(signUpData.full_name));
      dispatch(setEmail(signUpData.email));
      dispatch(setActiveStatus(true));
      dispatch(setCustomerStatus(signUpData.prov_cus === "Customer"));
      dispatch(setProviderStatus(signUpData.prov_cus === "Provider"));
      
      console.log("Sign Up Data:", signUpData);
    } else {
      if (!logInData.email_id || !logInData.password) {
        setError("Error: Please enter your email and password.");
        return;
      }
      console.log("Log In Data:", logInData);
      dispatch(setEmail(signUpData.email));
      dispatch(setActiveStatus(true));
      // dispatch(setCustomerStatus(false));
      // dispatch(setProviderStatus(false));
    }

    navigate("/");
  }

  return (

    // Text Pannel 
    <div className={`auth-container ${isSignUp ? "sign-up-mode" : ""}`}>
      <div className="text-panel">
        <h1 className="main_h1">{isSignUp ? "Sign Up" : "Log In"}</h1>
        <p className="subtext">
          {isSignUp ? "Join us today and start your journey!" : "Welcome back! Log in to continue."}
        </p>
        <p className="login-with">{isSignUp ? "Sign Up with" : "Log In with"}</p>
        <div className="social-login">
          <button className="google-login">
            <FaGoogle className="social-icon" /> Google
          </button>
          <button className="facebook-login">
            <FaFacebook className="social-icon" /> Facebook
          </button>
        </div>
        <div className="hr-container">
          <hr />
          <span className="hr-text">OR</span>
          <hr />
        </div>
        <p className="switch-text">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
        </p>
        <button className="toggle-button" onClick={toggleMode}>
          {isSignUp ? "Log In" : "Sign Up"}
        </button>
        <br />
        <p className="brand-text">Your Trusted Platform for Secure Access</p>
       
        <p className="quote">"The journey of a thousand miles begins with a single step."</p>
      </div>

      <div className="form-panel">
        {isSignUp ? (
          <SignUpForm signUpData={signUpData}handleChange={handleChange}handleSubmission={handleSubmission}error={error}/>
        ) : (
          <LoginForm logInData={logInData}handleChange={handleChange}handleSubmission={handleSubmission}error={error}/>)}
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
      </div>
    </div>
  );
}
//Helping functions for signup nad login

function LoginForm({ logInData, handleChange, handleSubmission, error }) {
  return (
    <form className="auth-form" onSubmit={handleSubmission}>
      <img id="logo" src="/favicon.ico" alt="Logo" />
      <input className="auth" type="email" name="email_id" value={logInData.email_id} required onChange={handleChange} placeholder="Email"/>
      <input className="auth"type="password" name="password" value={logInData.password} onChange={handleChange} placeholder="Password (At least 8 characters)" minLength="8" required
      />
      {error && <p className="error-message">{error}</p>}
      <button type="submit">Log In</button>
    </form>
  );
}

function SignUpForm({ signUpData, handleChange, handleSubmission, error }) {
  return (
    <form className="auth-form" onSubmit={handleSubmission}>
      <img id="logo" src="/favicon.ico" alt="Logo" />
      <br /><br /><br /><br />
      <input className="auth"type="text"name="full_name"value={signUpData.full_name}requiredonChange={handleChange}placeholder="Name"/>
      <input className="auth" type="email" name="email" value={signUpData.email} required onChange={handleChange} placeholder="E-mail"/>
      <input className="auth" type="password" name="password" value={signUpData.password} onChange={handleChange} placeholder="Password (At least 8 characters)" minLength="8" required/>
      <input className="auth"type="password"name="cnfrm_pass"value={signUpData.cnfrm_pass}onChange={handleChange}placeholder="Confirm Password"minLength="8"required/>
      {error && <p className="error-message">{error}</p>}
      <select id="cus_prov" name="prov_cus" value={signUpData.prov_cus} onChange={handleChange}>
        <option value="">Choose Your Role</option>
        <option value="Provider">Provider</option>
        <option value="Customer">Customer</option>
      </select>
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default AuthPage;
