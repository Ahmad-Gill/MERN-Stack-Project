import { useState, useEffect } from "react";
import "../componentCssFiles/Book_tickets.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

function Book_Now() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [flightsData, setFlightsData] = useState([]);
  const [searchParams] = useSearchParams();
  const flightIdFromSearch = searchParams.get("id"); // Get flight _id from the URL

  // Fetch flight data from the API
  useEffect(() => {
    fetch("http://localhost:5000/flight/geetAll")
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "All flights fetched successfully") {
          setFlightsData(data.flights);
        }
      })
      .catch((error) => console.error("Error fetching flight data:", error));
  }, []);

  // Filtered data based on search or _id from URL
  const filteredData = flightsData.filter((data) => {
    console.log("-----------------ID",flightIdFromSearch)
    const textMatch =
      data.flightName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.airlineCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const dateMatch =
      searchDate === "" || data.departureDate.split("T")[0] === searchDate;

    // If there's a flight ID in the searchParams, only show the matching flight
    const idMatch = flightIdFromSearch ? data._id === flightIdFromSearch : true;
   

    return textMatch && dateMatch && idMatch;
  });

  function goToDetails(
    id,
    flight,
    airline,
    departure,
    departure_time,
    departure_date,
    destination,
    boarding_time,
    arrival_date
  ) {
    navigate(
      `/Details/${id}/${flight}/${airline}/${departure}/${departure_time}/${departure_date}/${destination}/${boarding_time}/${arrival_date}`
    );
  }

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
            <th>Available Seats</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((data) => {
              const availableBusinessSeats =
                data.seatStats.business.totalSeats -
                data.seatStats.business.bookedSeats;
              const availableEconomySeats =
                data.seatStats.economy.totalSeats -
                data.seatStats.economy.bookedSeats;
              const availableFirstClassSeats =
                data.seatStats.firstClass.totalSeats -
                data.seatStats.firstClass.bookedSeats;
              const availablePremiumSeats =
                data.seatStats.premium.totalSeats -
                data.seatStats.premium.bookedSeats;

              const totalAvailableSeats =
                availableBusinessSeats +
                availableEconomySeats +
                availableFirstClassSeats +
                availablePremiumSeats;

              return (
                <tr key={data._id}>
                  <td>{data.flightName}</td>
                  <td>{data.airlineCode}</td>
                  <td>{data.origin}</td>
                  <td>{data.departureTime}</td>
                  <td>{data.departureDate.split("T")[0]}</td>
                  <td>{data.destination}</td>
                  <td>{data.arrivalTime}</td>
                  <td>{data.arrivalDate.split("T")[0]}</td>
                  <td>{totalAvailableSeats}</td>
                  <td>
                    {totalAvailableSeats === 0 ? (
                      <span>Full</span>
                    ) : (
                      <button
                        id="book_flight_button"
                        onClick={() =>
                          goToDetails(
                            data._id,
                            data.flightName,
                            data.airlineCode,
                            data.origin,
                            data.departureTime,
                            data.departureDate,
                            data.destination,
                            data.departureTime,
                            data.arrivalDate
                          )
                        }
                      >
                        Book Seat
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: "center", padding: "10px" }}>
                No Flights Available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Book_Now;
