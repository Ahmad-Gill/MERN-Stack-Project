import "../componentCssFiles/Details.scss";
import { useState, useEffect } from "react";
import Popup from "./Popup";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function Flight_Details() {
  const user = useSelector((state) => state.user);
  const {
    id,
    flight,
    airline,
    departure,
    departure_time,
    departure_date,
    destination,
    boarding_time,
    arrival_date,
  } = useParams();

  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);
  const [flight_details, setFlight_details] = useState({
    class: "",
    seat_prefer: "",
    seat_count: "",  // Number of seats selected
    meal_prefer: "",
  });
  const [matchedFlight, setMatchedFlight] = useState(null);
  const [availableSeatTypes, setAvailableSeatTypes] = useState([]);
  const [maxSeatsAvailable, setMaxSeatsAvailable] = useState(0);
  const [pricingData, setPricingData] = useState({});
  const [foodOptions, setFoodOptions] = useState([]);
  const [seatPrice, setSeatPrice] = useState(0); // Per-seat price

  // Fetch flight data
  useEffect(() => {
    fetch("http://localhost:5000/flight/geetAll")
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "All flights fetched successfully") {
          const foundFlight = data.flights.find((f) => f._id === id);
          if (foundFlight) {
            setMatchedFlight(foundFlight);
            const availableFoods = Object.entries(foundFlight.foodOptions)
              .filter(([_, available]) => available)
              .map(([foodType]) => foodType);
            setFoodOptions(availableFoods);
          }
        }
      })
      .catch((error) => console.error("Error fetching flight data:", error));
  }, [id]);

  // Update seat types and reset when class changes
  useEffect(() => {
    if (matchedFlight && flight_details.class) {
      const selectedClass = flight_details.class.toLowerCase();
      const seats = matchedFlight.seats[selectedClass];
      const pricing = matchedFlight.pricing[selectedClass];

      const seatTypes = Object.keys(seats).filter(
        (seatType) => seats[seatType].total > seats[seatType].booked
      );

      setAvailableSeatTypes(seatTypes);
      setPricingData(pricing);
      setFlight_details((prev) => ({
        ...prev,
        seat_prefer: "",
        seat_count: "",
      }));
      setSeatPrice(0);
      setMaxSeatsAvailable(0);
    }
  }, [matchedFlight, flight_details.class]);

  // Update seat count and pricing when seat type changes
  useEffect(() => {
    if (matchedFlight && flight_details.class && flight_details.seat_prefer) {
      const selectedClass = flight_details.class.toLowerCase();
      const seatType = flight_details.seat_prefer.toLowerCase();
      const seatData = matchedFlight.seats[selectedClass][seatType];
      const price = matchedFlight.pricing[selectedClass][seatType];

      const availableCount = seatData.total - seatData.booked;
      setMaxSeatsAvailable(availableCount);
      setSeatPrice(price);

      setFlight_details((prev) => ({
        ...prev,
        seat_count: "", // reset seat count on change
      }));
    }
  }, [matchedFlight, flight_details.class, flight_details.seat_prefer]);

  function handle_Click() {
    const { class: flightClass, seat_prefer, seat_count, meal_prefer } = flight_details;
    if (flightClass && seat_prefer && seat_count && meal_prefer) {
      const bookingData = {
        email: user.email,
        flightId: id,
        flightNo: flight,
        airline,
        departure,
        departure_time,
        departure_date,
        destination,
        arrival_date,
        boarding_time,
        selectedClass: flightClass,
        seatPreference: seat_prefer,
        seatCount: seat_count,
        mealPreference: meal_prefer,
        totalAmount: seatPrice * parseInt(seat_count),
      };
console.log(bookingData)
      fetch("http://localhost:5000/flight/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      })
        .then((response) => response.json())
        .then((data) => {
          setPopupMessage("Payment confirmed successfully!");
          setPopupType("success");
        })
        .catch((error) => {
          setPopupMessage("Something went wrong. Please try again.");
          setPopupType("error");
        });
    } else {
      setPopupMessage("Please fill all the details.");
      setPopupType("error");
    }
  }

  function handle_Change(event) {
    const { name, value } = event.target;
    setFlight_details((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  return (
    <div className="Book_Ticket_Container">
      <h1 id="ticket">Booking Details</h1>
      <div id="details_info">
        <div id="flight_details">
          <div className="detail_section">
            <p><strong>Flight No:</strong> {flight}</p>
            <p><strong>Airline:</strong> {airline}</p>
          </div>
          <div className="detail_section">
            <p><strong>Departure:</strong> {departure}</p>
            <p><strong>Departure Time:</strong> {departure_time}</p>
            <p><strong>Departure Date:</strong> {departure_date}</p>
          </div>
          <div className="detail_section">
            <p><strong>Arrival:</strong> {destination}</p>
            <p><strong>Arrival Date:</strong> {arrival_date}</p>
            <p><strong>Arrival Time:</strong> {boarding_time}</p>
          </div>
        </div>

        <div className="in_row">
  <label>Flight Class</label>
  <select name="class" value={flight_details.class} onChange={handle_Change}>
    <option value="">Choose your Class</option>
    {matchedFlight && Object.keys(matchedFlight.seats).map((seatClass) => {
      const availableSeats = matchedFlight.seats[seatClass];
      const totalSeats = Object.values(availableSeats).reduce((total, seatType) => total + seatType.total, 0);
      const bookedSeats = Object.values(availableSeats).reduce((total, seatType) => total + seatType.booked, 0);
      const availableCount = totalSeats - bookedSeats;
      
      if (availableCount > 0) {
        return (
          <option key={seatClass} value={seatClass}>
            {seatClass.charAt(0).toUpperCase() + seatClass.slice(1)} Class
          </option>
        );
      }
      return null; // Don't show the option if there are no available seats
    })}
  </select>
</div>


        {availableSeatTypes.length > 0 && (
          <div className="in_row">
            <label>Seat Preference</label>
            <select
              name="seat_prefer"
              value={flight_details.seat_prefer}
              onChange={handle_Change}
            >
              <option value="">Your Preference</option>
              {availableSeatTypes.map((seatType, index) => (
                <option key={index} value={seatType}>
                  {seatType.charAt(0).toUpperCase() + seatType.slice(1)} Seat
                </option>
              ))}
            </select>
          </div>
        )}

        {maxSeatsAvailable > 0 && (
          <div className="in_row">
            <label>Choose Number of Seats</label>
            <select
              name="seat_count"
              value={flight_details.seat_count}
              onChange={handle_Change}
            >
              <option value="">Select Seats</option>
              {Array.from({ length: maxSeatsAvailable }, (_, i) => i + 1).map((count) => (
                <option key={count} value={count}>
                  {count} seat{count > 1 ? "s" : ""} - ${count * seatPrice}
                </option>
              ))}
            </select>
          </div>
        )}

       

        {foodOptions.length > 0 && (
          <div className="in_row">
            <label>Food Type</label>
            <select
              name="meal_prefer"
              value={flight_details.meal_prefer}
              onChange={handle_Change}
            >
              <option value="">Choose your Type</option>
              {foodOptions.map((food, index) => (
                <option key={index} value={food}>
                  {food.charAt(0).toUpperCase() + food.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
         {flight_details.seat_count && (
          <div className="in_row">
            <strong>Total Price: ${seatPrice * parseInt(flight_details.seat_count)}</strong>
          </div>
        )}
      </div>

      <div id="Billing">
        <button id="Payment" onClick={handle_Click}>
          Confirm Seat
        </button>
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
  );
}

export default Flight_Details;
