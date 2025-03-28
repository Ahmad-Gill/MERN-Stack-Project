import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../componentCssFiles/SignUp.scss";

function Sign_up(){
   const navigate = useNavigate();

   const [error,setError] = useState("");
   const [signUpData , setSignUpData] = useState({
     full_name : '',
     password: '',
     Email: '',
     cnfrm_pass: '',
     prov_cus: ''       //Choosing b/w provider and customer
   });
    
   function handle_Change(event){
    const {name , value} = event.target;
    setSignUpData({...signUpData , [name]: value});
    setError("");
   }
   
   function handle_Submission(event){
    event.preventDefault();
    if (signUpData.password !== signUpData.cnfrm_pass){
      setError("Error!!! Password and Confirm Password Should be the Same");
      setSignUpData((prevData) => ({
        ...prevData, password: '' , cnfrm_pass: ''
      }));
      return;
    }
    setError("");
    navigate('/LogIn');
   }

   return (
    <div className = "signup_container" >
      <img id = "logo" src="/favicon.ico" alt="Logo" />
      <form id ="form" onSubmit = {handle_Submission}>
        <h1 id = "head_signup">Sign Up</h1>

        {/*Full Name*/}
        <label id = "label_signup" for = "full_name">Full Name           </label>
        <input id = "signup_input" type = "text" name = "full_name" value = {signUpData.full_name} required onChange = {handle_Change}/>
        
        {/*E-mail*/}
        <label for = "Email" id = "label_signup">E-mail         </label>
        <input id = "signup_input" type = "email" name = "Email" value = {signUpData.Email} required onChange = {handle_Change} />

        <br></br>
        {/*Password*/}
        <label for = "password" id = "label_signup">Password</label>
        <input id = "signup_input" type = "password" name = "password" value = {signUpData.password} onChange = {handle_Change} placeholder = "Atleast 8 characters" minLength = "8" required/>

        <br></br>
        {/*Confirm Password*/}
        <label for = "cnfrm_pass" id = "label_signup">Confirm Password</label>
        <input id = "signup_input" type = "password" name = "cnfrm_pass" value = {signUpData.cnfrm_pass} onChange = {handle_Change} placeholder = "Re-Write Your Password " minLength = "8" required/>

        {error && <p id = "ErrorMSG" style={{ color: "red", fontSize: "14px" }}>{error}</p>}

        <br></br>
        {/*Selection b/w Provider and Customer*/}
        <label for = "prov_cus" id = "label_signup">Sign Up As</label>
        <select id = "cus_prov" name="prov_cus" value = {signUpData.prov_cus} onChange = {handle_Change} required>
            <option value = "">Choose Your Role</option>
            <option value = "Provider">Provider</option>
            <option value = "Customer">Customer</option>
        </select>

        <br></br>
        <button id = "submit_button" type = "submit">Sign Up</button>
        <p id = "GoTologin" onClick={() => navigate("/LogIn")}>Already have an account ? LogIn</p>
    
    </form>

    </div>
  )   
}

export default Sign_up;