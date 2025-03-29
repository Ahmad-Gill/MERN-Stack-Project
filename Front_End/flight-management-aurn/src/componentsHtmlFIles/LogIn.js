import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../componentCssFiles/LogIn.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  setName,
  setEmail,
  setActiveStatus,
  setCustomerStatus,
  setProviderStatus,
} from "../store";

function Log_in(){
   const navigate = useNavigate();
   const [logInData , setLogInData] = useState({
     Password: '',
     Email_Id: ''
   });

   function handle_Change(event){
    const {name , value} = event.target;
    setLogInData({...logInData , [name]: value});
   }
   
   function handle_Submission(event){
    event.preventDefault();
    dispatch(setEmail(logInData.Email_Id));
    dispatch(setActiveStatus(true));
    dispatch(setCustomerStatus(true
    ));
    navigate('/');
   }

   const dispatch = useDispatch();
   const { name, email, isActive } = useSelector((state) => state.user);

   return (
    <div className = "login_page">
      <img id = "logo" src="/favicon.ico" alt="Logo" />
      <br></br>
      <br></br>
      <form id ="form" onSubmit = {handle_Submission}>
        <h1 id = "login_head">Log In</h1>

        {/*E-mail*/}
        <label id = "label_login" for = "Email_Id">E-mail         </label>
        <input id = "login_input" placeholder="Email"type = "email" name = "Email_Id" value = {logInData.Email_Id} required onChange = {handle_Change} />

        <br></br>
        {/*Password*/}
        <label for = "Password" id = "label_login">Password</label>
        <input type = "password" id = "login_input" name = "Password" value = {logInData.Password} onChange = {handle_Change} placeholder = "Atleast 8 characters" minLength = "8" required/>
         
        <br></br>

        <button id = "login_button" type = "submit">Log In</button>
        <p id = "GoTologin" onClick={() => navigate("/SignUP")}>Don't have an account ? Signup</p>
    </form>

    </div>
  )   
}

export default Log_in;