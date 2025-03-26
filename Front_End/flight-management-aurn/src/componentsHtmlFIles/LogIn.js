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
    navigate('/Home');
   }

   return (
    <div className = "container">
      <img src="/favicon.ico" alt="Logo" />
      <form id ="form" onSubmit = {handle_Submission}>
        <h1>Log In</h1>

        {/*E-mail*/}
        <label for = "Email_Id">E-mail         </label>
        <input type = "email" name = "Email_Id" value = {logInData.Email_Id} required onChange = {handle_Change} />

        <br></br>
        {/*Password*/}
        <label for = "Password">Password</label>
        <input type = "password" name = "Password" value = {logInData.Password} onChange = {handle_Change} placeholder = "Atleast 8 characters" minLength = "8" required/>
         
        <br></br>

        <button id = "login_button" type = "submit">Log In</button>
    </form>

    </div>
  )   
}

export default Log_in;