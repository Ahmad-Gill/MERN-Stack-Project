import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../componentCssFiles/SignUp.scss";

function Sign_up(){
   const navigate = useNavigate();
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
   }
   
   function handle_Submission(event){
    event.preventDefault();
   // setSignUpData(signUpData);
    //console.log(signUpData);
    navigate('/LogIn');
   }

   return (
    <div className = "container">
      <img src="/favicon.ico" alt="Logo" />
      <form id ="form" onSubmit = {handle_Submission}>
        <h1>Sign Up</h1>

        {/*Full Name*/}
        <label for = "full_name">Full Name           </label>
        <input type = "text" name = "full_name" value = {signUpData.full_name} required onChange = {handle_Change}/>
        
        {/*E-mail*/}
        <label for = "Email">E-mail         </label>
        <input type = "email" name = "Email" value = {signUpData.Email} required onChange = {handle_Change} />

        <br></br>
        {/*Password*/}
        <label for = "password">Password</label>
        <input type = "password" name = "password" value = {signUpData.password} onChange = {handle_Change} placeholder = "Atleast 8 characters" minLength = "8" required/>

        <br></br>
        {/*Confirm Password*/}
        <label for = "cnfrm_pass">Confirm Password</label>
        <input type = "password" name = "cnfrm_pass" value = {signUpData.cnfrm_pass} onChange = {handle_Change} placeholder = "Re-Write Your Password " minLength = "8" required/>

        <br></br>
        {/*Selection b/w Provider and Customer*/}
        <label for = "prov_cus">Sign Up As</label>
        <select name="prov_cus" value = {signUpData.prov_cus} onChange = {handle_Change} required>
            <option value = "">Choose Your Role</option>
            <option value = "Provider">Provider</option>
            <option value = "Customer">Customer</option>
        </select>
        <br></br>
        <button id = "submit_button" type = "submit">Sign Up</button>
        <p>Swipe Right to Log In</p>
    
    </form>

    </div>
  )   
}

export default Sign_up;