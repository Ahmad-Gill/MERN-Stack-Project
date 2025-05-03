import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../componentCssFiles/SignUp.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  setName,
  setEmail,
  setActiveStatus,
  setCustomerStatus,
  setProviderStatus,
} from "../store";

function Sign_up() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { name, email, isActive } = useSelector((state) => state.user);

  const [signUpData, setSignUpData] = useState({
    full_name: "",
    password: "",
    Email: "",
    cnfrm_pass: "",
    prov_cus: "", // Choosing between provider and customer
  });

  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState(""); // "success" or "error"

  function handle_Change(event) {
    const { name, value } = event.target;
    setSignUpData({ ...signUpData, [name]: value });
    setPopupMessage(""); // clear popup on change
  }

  async function handle_Submission(event) {
    event.preventDefault();

    if (signUpData.password !== signUpData.cnfrm_pass) {
      setPopupMessage("Error: Password and Confirm Password should be the same.");
      setPopupType("error");
      setSignUpData((prev) => ({ ...prev, password: "", cnfrm_pass: "" }));
      return;
    }

    const data = {
      name: signUpData.full_name,
      email: signUpData.Email,
      password: signUpData.password,
      provider: signUpData.prov_cus === "Provider",
      customer: signUpData.prov_cus === "Customer",
    };

    try {
      const response = await fetch("http://localhost:5000/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        dispatch(setName(signUpData.full_name));
        dispatch(setEmail(signUpData.Email));
        dispatch(setActiveStatus(true));
        dispatch(setCustomerStatus(signUpData.prov_cus === "Customer"));
        dispatch(setProviderStatus(signUpData.prov_cus === "Provider"));

        setPopupMessage("Signup successful!");
        setPopupType("success");
        navigate("/");
      } else {
        console.error("Signup error:", result.message);
        setPopupMessage(`Signup failed: ${result.message || "Unknown error"}`);
        setPopupType("error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setPopupMessage("Network error: " + error.message);
      setPopupType("error");
    }
  }

  return (
    <div className="signup_container">
      <img id="logo" src="/favicon.ico" alt="Logo" />
      <br /><br /><br /><br /><br /><br />
      <form id="form" onSubmit={handle_Submission}>
        <h1 id="head_signup">Sign Up</h1>

        <label id="label_signup" htmlFor="full_name">Full Name</label>
        <input
          id="signup_input"
          type="text"
          placeholder="name"
          name="full_name"
          value={signUpData.full_name}
          required
          onChange={handle_Change}
        />

        <label htmlFor="Email" id="label_signup">E-mail</label>
        <input
          id="signup_input"
          type="email"
          placeholder="Email"
          name="Email"
          value={signUpData.Email}
          required
          onChange={handle_Change}
        />

        <br />

        <label htmlFor="password" id="label_signup">Password</label>
        <input
          id="signup_input"
          type="password"
          name="password"
          value={signUpData.password}
          onChange={handle_Change}
          placeholder="At least 8 characters"
          minLength="8"
          required
        />

        <br />

        <label htmlFor="cnfrm_pass" id="label_signup">Confirm Password</label>
        <input
          id="signup_input"
          type="password"
          name="cnfrm_pass"
          value={signUpData.cnfrm_pass}
          onChange={handle_Change}
          placeholder="Re-write your password"
          minLength="8"
          required
        />

        {popupMessage && (
          <p
            id="ErrorMSG"
            style={{
              color: popupType === "error" ? "red" : "green",
              fontSize: "14px",
            }}
          >
            {popupMessage}
          </p>
        )}

        <br />

        <label htmlFor="prov_cus" id="label_signup">Sign Up As</label>
        <select
          id="cus_prov"
          name="prov_cus"
          value={signUpData.prov_cus}
          onChange={handle_Change}
        >
          <option value="">Choose Your Role</option>
          <option value="Provider">Provider</option>
          <option value="Customer">Customer</option>
        </select>

        <br />
        <button id="submit_button" type="submit">Sign Up</button>
        <p id="GoTologin" onClick={() => navigate("/LogIn")}>
          Already have an account? Log In
        </p>
      </form>
    </div>
  );
}

export default Sign_up;
