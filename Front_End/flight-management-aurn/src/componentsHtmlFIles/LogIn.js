import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../componentCssFiles/LogIn.scss";

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
    navigate('/');
   }

   return (
    <div className = "login_page">
      <img id = "logo" src="/favicon.ico" alt="Logo" />
      <form id ="form" onSubmit = {handle_Submission}>
        <h1 id = "login_head">Log In</h1>

        {/*E-mail*/}
        <label id = "label_login" for = "Email_Id">E-mail         </label>
        <input id = "login_input" type = "email" name = "Email_Id" value = {logInData.Email_Id} required onChange = {handle_Change} />

        <br></br>
        {/*Password*/}
        <label for = "Password" id = "label_login">Password</label>
        <input type = "password" id = "login_input" name = "Password" value = {logInData.Password} onChange = {handle_Change} placeholder = "Atleast 8 characters" minLength = "8" required/>
         
        <br></br>

        <button id = "login_button" type = "submit">Log In</button>
    </form>

    </div>
  )   
}

export default Log_in;