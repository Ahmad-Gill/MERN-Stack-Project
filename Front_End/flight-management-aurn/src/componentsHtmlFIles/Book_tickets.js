import data_flight from '../componentsJsFiles/flights_data.json';
import "../componentCssFiles/Book_tickets.scss";
import { useNavigate } from "react-router-dom";

function Book_Now(){

    const navigate = useNavigate();

    function goToDetails(flight,airline,departure,departure_time,departure_date,destination,boarding_time,arrival_date){
        navigate(`/Details/${flight}/${airline}/${departure}/${departure_time}/${departure_date}/${destination}/${boarding_time}/${arrival_date}`);
    }


   return(
   <div className = "Flights">
    <h2 id = "flight_heading">Flights</h2>
    <table id = "Flight_Table">
        <thead>
            <tr>
              <th id = "flight_no">Flight No.</th>
              <th id = "airways">Airways</th>
              <th id = "departure">Departure</th>
              <th id = "dept_time">Time</th>
              <th id = "dept_date">Date</th>
              <th id = "arrival">Arrival</th>
              <th id = "arr_time">Time</th>
              <th id = "arr_date">Date</th>
              <th id = "book_buton"></th>
            </tr>
        </thead>

        <tbody>
            {data_flight.map((data,index) => (
                <tr key = {index}>
                    <td className = "flight_data">{data.flight}</td>
                    <td className = "airways_data">{data.airline}</td>
                    <td className = "departure_data">{data.departure}</td>
                    <td className = "dept_time_data">{data.departure_time}</td>
                    <td className = "dept_date_data">{data.date}</td>
                    <td className = "arrival_data">{data.destination}</td>
                    <td className = "arr_time_data">{data.boarding_time}</td>
                    <td className = "arr_date_data">{data.date}</td>
                    <td className= "book_flight">
                        <button id = "book_flight_button" onClick={() => goToDetails(data.flight,data.airline,data.departure,data.departure_time,data.date,data.destination,data.boarding_time,data.date)}>Book Seat</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>

   </div>
)}

export default Book_Now;