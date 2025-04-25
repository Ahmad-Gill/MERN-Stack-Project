import { useState } from "react";
import data_flight from '../componentsJsFiles/flights_data.json';
import "../componentCssFiles/Book_tickets.scss";
import { useNavigate } from "react-router-dom";

function Book_Now() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");

  function goToDetails(flight, airline, departure, departure_time, departure_date, destination, boarding_time, arrival_date) {
    navigate(`/Details/${flight}/${airline}/${departure}/${departure_time}/${departure_date}/${destination}/${boarding_time}/${arrival_date}`);
  }

  // Filtered data based on search
  const filteredData = data_flight.filter((data) => {
    const textMatch =
      data.flight.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const dateMatch = searchDate === "" || data.date === searchDate;

    return textMatch && dateMatch;
  });

  return (
    <div className="Flights">
      <h1 id="flight_heading">Flights</h1>

      {/* Search bar */}
      <div className="search-container">
  <input
    type="text"
    className="search-input"
    placeholder="Search by flight no, airline, departure, arrival..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <input
    type="date"
    className="search-input"
    value={searchDate}
    onChange={(e) => setSearchDate(e.target.value)}
  />
</div>


      <table id="Flight_Table">
        <thead>
          <tr>
            <th>Flight No.</th>
            <th>Airways</th>
            <th>Departure</th>
            <th>Time</th>
            <th>Date</th>
            <th>Arrival</th>
            <th>Time</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
  {filteredData.length > 0 ? (
    filteredData.map((data, index) => (
      <tr key={index}>
        <td>{data.flight}</td>
        <td>{data.airline}</td>
        <td>{data.departure}</td>
        <td>{data.departure_time}</td>
        <td>{data.date}</td>
        <td>{data.destination}</td>
        <td>{data.boarding_time}</td>
        <td>{data.date}</td>
        <td>
          <button
            id="book_flight_button"
            onClick={() =>
              goToDetails(
                data.flight,
                data.airline,
                data.departure,
                data.departure_time,
                data.date,
                data.destination,
                data.boarding_time,
                data.date
              )
            }
          >
            Book Seat
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="9" style={{ textAlign: "center", padding: "10px" }}>
        Empty
      </td>
    </tr>
  )}
</tbody>

      </table>
    </div>
  );
}

export default Book_Now;
