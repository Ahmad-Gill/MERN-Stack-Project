import "../componentCssFiles/Details.scss";
import { useState } from "react";
import Popup from "./Popup";
import { useParams } from "react-router-dom";

function Flight_Details() {
    const {flight,airline,departure,departure_time,departure_date,destination,boarding_time,arrival_date} = useParams(); 
    const [popupType, setPopupType] = useState(null);
    const [popupMessage, setPopupMessage] = useState(null);
    const [flight_details , setFlight_details] = useState({
        class: "",
        seat_prefer: "",
        meal_prefer: "",
    }); 

    // Hard Coded for Now!!
    const economy_price = "$500";
    const economy_prem_price = "$2000";
    const bus_class = "$10,000";
    const first_class = "$20,000";

    function handle_Click(){
        if (flight_details.class) {
            setPopupMessage("Payment confirmed successfully!");
            setPopupType("success");
        } else {
            setPopupMessage("Please Fill all the Details");
            setPopupType("error");
        }
    }

    function handle_Change(event){
    const {name , value} = event.target;
    setFlight_details(prevState => ({
        ...prevState,
        [name]: value,
    }));
    }

   return(
    <div className="Book_Ticket_Container">
        <h1 id = "ticket">Booking Details</h1>
        <div id = "details_info">
            <p id =" flight">Flight No:  {flight}</p>
            <p id = "airways">Airline:  {airline}</p>
            <br />
            <p id = "depa">Departure:  {departure}</p>
            <p id = "depa_time">Departure Time:  {departure_time}</p>
            <p id = "depa_date">Departure Date:  {departure_date}</p>
            <br />
            <p id = "dest">Arrival:  {destination}</p>
            <p id = "dest_date">Arrival Date:  {arrival_date}</p>
            <p id = "dest_time">Arrival Time: {boarding_time}</p>

        {/*Seat*/}
        <div className="in_row">
        <label id = "seat_prefer">Seat Preference</label>
        <select id = "seat_booking" name = "seat_prefer"value = {flight_details.seat_prefer} onChange={handle_Change}>
            <option value = "">Your Preference</option>
            <option value = "Window">Window Seat</option>
            <option value = "Aisle">Aisle Seat</option>
            <option value = "Middle">Middle Seat</option>
        </select>
        </div>

        {/*Class*/}
        <div className="in_row">
        <label id = "class">Flight Class</label>
        <select id = "class_booking" name = "class" value = {flight_details.class} onChange={handle_Change}>
            <option value = "">Choose your Class</option>
            <option value = "Business">Business Class</option>
            <option value = "Economy">Economy Class</option>
            <option value = "First">First Class</option>
            <option value = "Premium">Premium Economy</option>
        </select>
        </div>

        {/*Meal*/}
        <div className="in_row">
        <label id = "meal_prefer">Food Type</label>
        <select id = "class_booking" name = "meal_prefer" value = {flight_details.meal_prefer} onChange={handle_Change}>
            <option value = "">Choose your Type</option>
            <option value = "Veg">Veg</option>
            <option value = "Non-Veg">Non-Veg</option>
            <option value = "Chicken">Chicken</option>
            <option value = "Beef">Beef</option>
            <option value = "Mutton">Mutton</option>
        </select>
        </div>
        </div>

        <div id = "Billing">
       {/*} <h3 id = "Billing_Pay">Billing and Payment</h3>
        {flight_details.class === "Business" ? <p id = "price">Total Bill: {bus_class}</p> : 
        flight_details.class === "Economy" ? <p id = "price">Total Bill: {economy_price}</p> : 
        flight_details.class === "Premium" ? <p id = "price">Total Bill: {economy_prem_price}</p> : 
        flight_details.class === "First" ? <p id = "price">Total Bill: {first_class}</p> : ""}*/}
        <button id = "Payment" onClick = {handle_Click}>Confirm Payment</button>
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
    </div>
   )
    
}

export default Flight_Details;
