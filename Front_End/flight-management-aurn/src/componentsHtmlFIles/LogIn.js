import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../componentCssFiles/LogIn.scss";
import { useDispatch } from "react-redux";
import {
  setName,
  setEmail,
  setActiveStatus,
  setCustomerStatus,
  setProviderStatus,
} from "../store";

function Log_in() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logInData, setLogInData] = useState({
    Email_Id: "",
    Password: "",
  });

  const [error, setError] = useState("");

  function handle_Change(event) {
    const { name, value } = event.target;
    setLogInData({ ...logInData, [name]: value });
  }

  async function handle_Submission(event) {
    event.preventDefault();

    if (!logInData.Email_Id || !logInData.Password) {
      setError("Error: Please enter your email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: logInData.Email_Id,
          password: logInData.Password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.message === "Login successful") {
        const user = data.user;

        // Dispatch Redux actions
        dispatch(setEmail(user.email));
        dispatch(setName(user.name));
        dispatch(setActiveStatus(true));
        dispatch(setCustomerStatus(user.customer)); // true/false
        dispatch(setProviderStatus(user.provider)); // true/false

        // Redirect to homepage
        navigate("/");
      } else {
        setError("Error: " + (data.message || "Login failed."));
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Error: Something went wrong.");
    }
  }

  return (
    <div className="login_page">
      <img id="logo" src="/favicon.ico" alt="Logo" />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      
      <form id="form" onSubmit={handle_Submission}>
        <h1 id="login_head">Log In</h1>

        {/* E-mail */}
        <label id="label_login" htmlFor="Email_Id">E-mail</label>
        <input
          id="login_input"
          placeholder="Email"
          type="email"
          name="Email_Id"
          value={logInData.Email_Id}
          required
          onChange={handle_Change}
        />

        {/* Password */}
        <label id="label_login" htmlFor="Password">Password</label>
        <input
          type="password"
          id="login_input"
          name="Password"
          value={logInData.Password}
          onChange={handle_Change}
          placeholder="At least 8 characters"
          minLength="8"
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button id="login_button" type="submit">Log In</button>
        <p id="GoTologin" onClick={() => navigate("/SignUP")}>
          Don't have an account? Signup
        </p>
      </form>
    </div>
  );
}

export default Log_in;
