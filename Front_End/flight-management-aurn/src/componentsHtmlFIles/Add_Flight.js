import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../componentCssFiles/addFligh.scss";

function AddFlight() {
  const email = useSelector((state) => state.user.email);
  const [flightDetails, setFlightDetails] = useState({
    flightName: "",
    airlineCode: "",
    origin: "",
    destination: "",
    departureDate: "",
    arrivalDate: "",
    departureTime: "",
    arrivalTime: "",
    seats: {
      business: { window: 0, middle: 0, aisle: 0 },
      economy: { window: 0, middle: 0, aisle: 0 },
      firstClass: { window: 0, middle: 0, aisle: 0 },
      premium: { window: 0, middle: 0, aisle: 0 },
    },
    pricing: {
      business: { window: 0, middle: 0, aisle: 0 },
      economy: { window: 0, middle: 0, aisle: 0 },
      firstClass: { window: 0, middle: 0, aisle: 0 },
      premium: { window: 0, middle: 0, aisle: 0 },
    },
    foodOptions: {
      veg: true,
      nonVeg: false,
      mutton: false,
      beef: false,
    },
    status: "On Time",
  });

  // Handle changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlightDetails({
      ...flightDetails,
      [name]: value,
    });
  };

  const handleSeatsChange = (e, classType, seatType) => {
    const { value } = e.target;
    setFlightDetails({
      ...flightDetails,
      seats: {
        ...flightDetails.seats,
        [classType]: {
          ...flightDetails.seats[classType],
          [seatType]: parseInt(value, 10),  // Convert to number
        },
      },
    });
  };
  
  const handlePricingChange = (e, classType, seatType) => {
    const { value } = e.target;
    setFlightDetails({
      ...flightDetails,
      pricing: {
        ...flightDetails.pricing,
        [classType]: {
          ...flightDetails.pricing[classType],
          [seatType]: parseFloat(value),  // For decimal values
        },
      },
    });
  };
  

  const handleFoodOptionsChange = (e) => {
    const { name, checked } = e.target;
    setFlightDetails({
      ...flightDetails,
      foodOptions: {
        ...flightDetails.foodOptions,
        [name]: checked,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const dataToSend = {
      ...flightDetails,
      email, // include the email of the user submitting
    };
  
    try {
      const response = await fetch("http://localhost:5000/flight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Flight added successfully!");
        console.log(result);
      } else {
        alert("Failed to add flight: " + result.message);
        console.error(result);
      }
    } catch (error) {
      alert("Error connecting to server");
      console.error("Error:", error);
    }
  };
  

  return (
    <div className="add-flight-form">

      <h1>Add Flight</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <label>Flight Name</label>
          <input
            type="text"
            name="flightName"
            value={flightDetails.flightName}
            onChange={handleChange}
          />
        </div>
        <div className="form-section">
          <label>Airline Code</label>
          <input
            type="text"
            name="airlineCode"
            value={flightDetails.airlineCode}
            onChange={handleChange}
          />
        </div>
        <div className="form-section">
          <label>Origin</label>
          <input
            type="text"
            name="origin"
            value={flightDetails.origin}
            onChange={handleChange}
          />
        </div>
        <div className="form-section">
          <label>Destination</label>
          <input
            type="text"
            name="destination"
            value={flightDetails.destination}
            onChange={handleChange}
          />
        </div>
        <div className="form-section">
          <label>Departure Date</label>
          <input
            type="date"
            name="departureDate"
            value={flightDetails.departureDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-section">
          <label>Arrival Date</label>
          <input
            type="date"
            name="arrivalDate"
            value={flightDetails.arrivalDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-section">
          <label>Departure Time</label>
          <input
            type="time"
            name="departureTime"
            value={flightDetails.departureTime}
            onChange={handleChange}
          />
        </div>
        <div className="form-section">
          <label>Arrival Time</label>
          <input
            type="time"
            name="arrivalTime"
            value={flightDetails.arrivalTime}
            onChange={handleChange}
          />
        </div>
        <div className="form-section">
          <h3>Seats</h3>
          {["business", "economy", "firstClass", "premium"].map((classType) => (
            <div key={classType} className="seat-class">
              <h4>{classType}</h4>
              {["window", "middle", "aisle"].map((seatType) => (
                <div key={seatType}>
                  <label>{seatType}</label>
                  <input
                    type="number"
                    min="0"
                    value={flightDetails.seats[classType][seatType]}
                    onChange={(e) => handleSeatsChange(e, classType, seatType)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="form-section">
          <h3>Pricing</h3>
          {["business", "economy", "firstClass", "premium"].map((classType) => (
            <div key={classType} className="seat-class">
              <h4>{classType}</h4>
              {["window", "middle", "aisle"].map((seatType) => (
                <div key={seatType}>
                  <label>{seatType}</label>
                  <input
                    type="number"
                    min="0"
                    value={flightDetails.pricing[classType][seatType]}
                    onChange={(e) => handlePricingChange(e, classType, seatType)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="form-section">
  <h3>Food Options</h3>
  <label>
    <input
      type="checkbox"
      name="veg"
      checked={flightDetails.foodOptions.veg}
      onChange={handleFoodOptionsChange}
    />
    Veg
  </label>
  <label>
    <input
      type="checkbox"
      name="nonVeg"
      checked={flightDetails.foodOptions.nonVeg}
      onChange={handleFoodOptionsChange}
    />
    Non-Veg
  </label>
  <label>
    <input
      type="checkbox"
      name="mutton"
      checked={flightDetails.foodOptions.mutton}
      onChange={handleFoodOptionsChange}
    />
    Mutton
  </label>
  <label>
    <input
      type="checkbox"
      name="beef"
      checked={flightDetails.foodOptions.beef}
      onChange={handleFoodOptionsChange}
    />
    Beef
  </label>
</div>

        <div className="form-section">
          <label>Status</label>
          <select
            name="status"
            value={flightDetails.status}
            onChange={handleChange}
          >
            <option value="On Time">On Time</option>
            <option value="Delayed">Delayed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button type="submit">Add Flight</button>
      </form>
    </div>
  );
}

export default AddFlight;
