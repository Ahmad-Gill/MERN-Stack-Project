import "../componentCssFiles/home.scss";
import "../componentCssFiles/home_consumer.scss";
import useFetchReviews from "../componentsHtmlFIles/CustomerReviews";
import React, { useState, useEffect } from "react";
import FaqFetcher from '../componentsHtmlFIles/FaqFetcher';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; 
import Popup from "../componentsHtmlFIles/Popup";
import { useNavigate } from "react-router-dom";
import PlaneLoading from "../componentsHtmlFIles/PlaneLoading";   // for ANimation



import { useSelector, useDispatch } from "react-redux";
import { setName, setEmail, setActiveStatus, setCustomerStatus, setProviderStatus, resetUser } from "../store";


const countries = {
  "USA": { lat: 37.0902, lon: -95.7129 },
  "Canada": { lat: 56.1304, lon: -106.3468 },
  "UK": { lat: 55.3781, lon: -3.4360 },
  "Germany": { lat: 51.1657, lon: 10.4515 },
  "France": { lat: 46.6034, lon: 1.8883 },
  "Italy": { lat: 41.8719, lon: 12.5674 },
  "Spain": { lat: 40.4637, lon: -3.7492 },
  "Australia": { lat: -25.2744, lon: 133.7751 },
  "India": { lat: 20.5937, lon: 78.9629 },
  "China": { lat: 35.8617, lon: 104.1954 },
  "Brazil": { lat: -14.2350, lon: -51.9253 },
  "South Africa": { lat: -30.5595, lon: 22.9375 },
  "Japan": { lat: 36.2048, lon: 138.2529 },
  "Russia": { lat: 61.5240, lon: 105.3188 },
  "Mexico": { lat: 23.6345, lon: -102.5528 },
  "Argentina": { lat: -38.4161, lon: -63.6167 },
  "Saudi Arabia": { lat: 23.8859, lon: 45.0792 },
  "UAE": { lat: 23.4241, lon: 53.8478 },
  "Turkey": { lat: 38.9637, lon: 35.2433 },
  "South Korea": { lat: 35.9078, lon: 127.7669 }
};
// --------------------------------------------------------used to calculate the distance 
const haversineDistance = (lat1, lon1, lat2, lon2) => {  
  const toRad = (angle) => (Math.PI / 180) * angle;
  const R = 6371; 
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

function Home() {
  const user = useSelector((state) => state.user);       //REdux comands
  const { isActive, isCustomer, isProvider } = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);    // set isLoading for animation
  const { reviews, loading, error } = useFetchReviews();
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState(1);
  const [totalCost, setTotalCost] = useState(0);
  const [faqs, setFaqs] = useState([]);
  const [departure, setDeparture] = useState("USA");
  const [destination, setDestination] = useState("Canada");
  const [price, setPrice] = useState(0);
  const [distance, setDistance] = useState(0);
    const [popupType, setPopupType] = useState(null);
    const [popupMessage, setPopupMessage] = useState(null);
  const [jetImages, setJetImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const handleClick = () => {
    if (!isActive) {
        setPopupMessage("Please log in first!");
        setPopupType("error");
        return;
    }
    if (isCustomer) {
        navigate("/Book_tickets"); // Replace with the actual route
    } else if (isProvider) {
        navigate("#"); // Replace with the actual route
    } else {
      setPopupMessage("You are an Admin. You can't book anything.");
      setPopupType("error");
    }
};
const calculatePrice = () => {
  setIsLoading(true); // Show loading animation 

  if (departure === destination) {  
      setPopupMessage("Departure and destination cannot be the same.");
      setPopupType("error");
      setTimeout(() => setIsLoading(false), 1000); // Hide loading after 1 second
      return;
  }

  const depCoords = countries[departure];
  const destCoords = countries[destination];

  if (!depCoords || !destCoords) {
      setPopupMessage("Invalid locations selected.");
      setPopupType("error");
      setTimeout(() => setIsLoading(false), 1000); // Hide loading after 1 second
      return;
  }

  // Simulate data fetching delay
  setTimeout(() => {
      const dist = haversineDistance(depCoords.lat, depCoords.lon, destCoords.lat, destCoords.lon);
      setDistance(dist);

      const basePricePerPerson = (dist / 5) * 100;
      const totalPrice = basePricePerPerson * passengers;

      setPrice(totalPrice);
      setIsLoading(false); // Hide loading animation after processing
  }, 1500); // Simulate 1.5s delay for calculation
};



//----------------------------------------------------------------FAG Open ANd CLose 
  const toggleAnswer = (index) => {
    setFaqs((prevFaqs) =>
      prevFaqs.map((faq, i) =>
        i === index ? { ...faq, isOpen: !faq.isOpen } : faq
      )
    );
  };
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // Toggle between opening and closing the FAQ item
  };

  //-------------------------GET IMages from Public FOlders------------------------
  useEffect(() => {
    // Fetch images dynamically (assuming they are named jet1, jet2, jet3...)
    const loadImages = async () => {
      const imageList = [];
      let index = 1;
      while (true) {
        const imagePath = `/images/${index}.png`;
        try {
          const img = new Image();
          img.src = imagePath;

          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });

          imageList.push(imagePath);
          index++;
        } catch {
          break;
        }
      }
      setJetImages(imageList);
    };
    loadImages();
  }, []);
  return (
    <>
      {isLoading && <PlaneLoading isLoading={isLoading} />}         {/* For ANimation */}

          {/*--------------------------------- Hero Section---------------- */}
  <div className="home-container">
    <div className="hero">
        <div className="video-container">
          <video autoPlay loop muted className="hero-video">
            <source src="/1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="hero-text">
  
          <h1>Experience Luxury in the Sky</h1>
<p>
    {isCustomer ? "Book Your Private Jet Seamlessly" : 
    isProvider ? "List Your Private Jet with Ease" : 
    "Manage and Oversee Bookings as an Admin"}
</p>

          <button className="cta-button" onClick={handleClick} disabled={!isActive}>
    {isActive ? (isCustomer ? "Book Now" : isProvider ? "Add Listing" : "Manage") : "Disabled"}
</button>

        </div>
      </div>

 {/*--------------------------------- Explore DIfferent jets types in Detail Section---------------- */}
     <div className="luxury-experience">
        <div className="luxury-video-section">
          <video autoPlay loop muted playsInline>
            <source src="/2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="luxury-text-section">
        <h1>Explore the Different Types of Jets</h1>

        <p>Explore and Compare Various Types of Private Jets</p>
        <button className="luxury-cta-button" onClick={() => navigate("/jet-types")}>Explore</button>
        </div>
</div>

 {/*--------------------------------- Flight Pricing Calculator Section---------------- */}
  <h2 className="heading">Flight Pricing Calculator</h2>
  <div className="flight-calculator">
      <div className="text-container">
          <p className="paragraph">
              This is the estimated cost and is charged up to <strong>$100 per 5 km per person</strong>. 
              The actual cost depends on the type of jet and the departure date.
          </p>
          <div className="result-container">
              <h3 className="result">Distance: {distance.toFixed(2)} km</h3>
              <h3 className="result">
                  Total Price for {passengers} {passengers === 13 ? "Seats" : "Passenger(s)"}: 
                  ${price.toFixed(2)}
              </h3>
          </div>
      </div>

      <div className="form-container">
          <div className="input-group">
              <label>Departure:</label>
              <select value={departure} onChange={(e) => setDeparture(e.target.value)}>
                  {Object.keys(countries).map((country) => (
                      <option key={country} value={country}>{country}</option>
                  ))}
              </select>
          </div>

          <div className="input-group">
              <label>Destination:</label>
              <select value={destination} onChange={(e) => setDestination(e.target.value)}>
                  {Object.keys(countries).map((country) => (
                      <option key={country} value={country}>{country}</option>
                  ))}
              </select>
          </div>

          <div className="passenger-container">
              <label>Passengers:</label>
              <select value={passengers} onChange={(e) => setPassengers(parseInt(e.target.value))}>
                  {[...Array(12).keys()].map(num => (
                      <option key={num + 1} value={num + 1}>{num + 1}</option>
                  ))}
                  <option value={13}>Book Entire Jet (13 seats)</option>
              </select>
          </div>

          <button className="calculate-btn" onClick={calculatePrice}>Calculate Price</button>
      </div>
  </div>


 {/*--------------------------------- About Us section Section---------------- */}
    <br />
    <h1 className="heading">About Us</h1>
    <br />
    <div className="about-us">

        <p>We are partners from the National University of Computer and Emerging Sciences. I am Muhammad Ahmad, and my partner is Nimra Amer.</p>  
        <p>We are a leading provider of luxury private jet services, committed to delivering unparalleled experiences to our clients.</p>  

          <img src="/images/about.png" alt="Our Team" />
    </div>

    <br />


 {/*--------------------------------- Features Section---------------- */}
    <h2 className="heading">Our Features</h2>
    <br />
    <div className="features row">
      <div className="col-12 col-sm-6 col-md-4 feature-item" style={{ backgroundImage: "url('/images/1.png')" }}>
        <h3>Luxury Experience</h3>
        <p>Experience the best in luxury travel with our state-of-the-art jets.</p>
      </div>
      <div className="col-12 col-sm-6 col-md-4 feature-item" style={{ backgroundImage: "url('/images/booking.png')" }}>
        <h3>Seamless Booking</h3>
        <p>Book your private jet in a few clicks and enjoy a hassle-free experience.</p>
      </div>
      <div className="col-12 col-sm-6 col-md-4 feature-item" style={{ backgroundImage: "url('/images/service.png')" }}>
        <h3>24/7 Support</h3>
        <p>Our team is available around the clock to assist with your needs.</p>
      </div>
    </div>

<br />

 {/*--------------------------------- Galery of luxury jets Section---------------- */}
        <h2 className="heading">Our Luxury Jets</h2>
        <br />

      <div className="jet-showcase">

              <div className="jet-gallery">
                {jetImages.map((image, index) => (
                  <div key={index} className="jet-item">
                    <img src={image} alt={`Jet ${index + 1}`} />
                  </div>
                ))}
              </div>
      </div>

      <br />

 {/*--------------------------------- Customer Reviews---------------- */}
            <h2 className="heading">What Our Customers Say</h2>
            <br />
      <div className="customer-reviews">
            {loading && <p className="loading">Loading reviews...</p>}
            {error && <p className="error">{error}</p>}

            <div className="reviews-gallery">
                {Array.isArray(reviews) && reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className="review-item">
                            <div className="review-text">"{review.text}"</div>
                            <div className="review-author">- {review.author}</div>
                        </div>
                    ))
                ) : (
                    <p>No reviews available.</p>
                )}
            </div>
        </div>
 {/*--------------------------------- Our partners Section---------------- */}
        <br />
        <h2 className="heading">Our Patners</h2>
    <br />
<div className="clients">

  <div className="client-logos">
    <img src="/patner1.png" alt="Client 1" />
    <img src="/patner2.png" alt="Client 2" />
    <img src="/patner3.png" alt="Client 3" />
    <img src="/patner4.png" alt="Client 2" />
    <img src="/patner5.png" alt="Client 3" />
  </div>
</div>

<br />




 {/*--------------------------------- Frequeently asked QUestions Section---------------- */}
        <h2 className="heading">Frequently Asked Questions</h2>
        <br />
        <div className="faq">

      <FaqFetcher setFaqs={setFaqs} />
      {faqs.length === 0 ? (
        <p>Loading FAQs...</p>
      ) : (
        faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleAnswer(index)}>
              <h3>{faq.question}</h3>
              {faq.isOpen ? (
                <FaChevronUp className="faq-arrow" />
              ) : (
                <FaChevronDown className="faq-arrow" />
              )}
            </div>
            {faq.isOpen && <p>{faq.answer}</p>}
          </div>
        ))
      )}
    </div>

    <br />



 {/*--------------------------------- POP up message ---------------- */}
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
  </>    

  );
}

export default Home;