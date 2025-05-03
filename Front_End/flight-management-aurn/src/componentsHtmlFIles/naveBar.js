import React, { useState, useRef, useEffect } from "react";
import "../componentCssFiles/naveBar.scss";
import {
  FaSearch,
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaBell,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Notifications from "../componentsHtmlFIles/Notifications";
import { useUser } from "../componentsHtmlFIles/UserContext";
import { resetUser } from "../store";
import { useSelector, useDispatch } from "react-redux";

function NveBar() {
  const dispatch = useDispatch();
  const { isActive, isCustomer, isProvider } = useSelector(
    (state) => state.user
  );
  const { profileImage } = useUser();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const user = useSelector((state) => state.user);
  const [results, setResults] = useState([]);
  const [allFlights, setAllFlights] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);

  const searchRef = useRef(null);
  const notificationsRef = useRef(null);

  // Fetch all flights
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await fetch("http://localhost:5000/flight/geetAll");
        const data = await res.json();
        if (data.message === "All flights fetched successfully") {
          setAllFlights(data.flights);
        }
      } catch (error) {
        console.error("Error fetching flights:", error);
      }
    };

    fetchFlights();
  }, []);

  // Search filter
  const handleType = (e) => {
    const query = e.target.value.trim();
    setSearch(query);

    if (query === "") {
      setResults([]);
      return;
    }

    const matches = allFlights.filter((flight) => {
      return (
        flight.flightName.toLowerCase().includes(query.toLowerCase()) ||
        flight.airlineCode.toLowerCase().includes(query.toLowerCase()) ||
        flight.origin.toLowerCase().includes(query.toLowerCase()) ||
        flight.destination.toLowerCase().includes(query.toLowerCase())
      );
    });

    setResults(matches);
  };

  const handleSelect = (flightId) => {
    setResults([]);
    navigate(`/Book_tickets?id=${flightId}`);
  };

  const toggleBrightness = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  // Close panels when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setResults([]);
        setSearch("");
        setPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="navBArMain">
      {/* Logo */}
      <div className="logo">
        <Link to="/">
          <img src="/favicon.ico" alt="Logo" />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
  <Link to="/" onClick={() => setMenuOpen(false)}>
    Home
  </Link>

  {isCustomer && isActive && (
    <>
      <Link to="/Analytics_consumer" onClick={() => setMenuOpen(false)}>
        Analytics
      </Link>
      <Link to="/flights" onClick={() => setMenuOpen(false)}>
        Flights
      </Link>
    </>
  )}

  {isProvider && isActive && (
    <>
      <Link to="/Analytics_provider" onClick={() => setMenuOpen(false)}>
        Analytics
      </Link>
      <Link to="/UpcomingFlights_provider" onClick={() => setMenuOpen(false)}>
        Flights
      </Link>
    </>
  )}

  {!isCustomer && !isProvider && isActive && (
    <>
      <Link to="/AnalyticsAdmin" onClick={() => setMenuOpen(false)}>
        Providers
      </Link>
      <Link to="/UpcomingFlights_admin" onClick={() => setMenuOpen(false)}>
        Customers
      </Link>
      <Link to="/AdminChart" onClick={() => setMenuOpen(false)}>
        Queries
      </Link>
    </>
  )}

  {isActive ? (
    <Link
      to="/"
      onClick={() => {
        dispatch(resetUser());
        setMenuOpen(false);
      }}
    >
      LogOut
    </Link>
  ) : (
    <Link to="/auth" onClick={() => setMenuOpen(false)}>
      LogIn
    </Link>
  )}
</div>


      {/* Search */}
      <div className="search-container" ref={searchRef}>
        <div className="search-box">
          {isCustomer ? (
            <input
              className="NaveSearch"
              placeholder="Search Flights"
              value={search}
              onChange={handleType}
            />
          ) : (
            <input
              className="NaveSearch"
              placeholder="You do not have access to search flights."
              disabled
            />
          )}
          <FaSearch className="search-icon" />
        </div>

        {/* Search Results */}
        {isCustomer && isActive && results.length > 0 && (
          <div className="search-results-container">
            <ul className="results-list">
              {results.map((flight) => (
                <li key={flight._id} onClick={() => handleSelect(flight._id)}>
                  <div className="flight-name">
                    {flight.flightName} ({flight.airlineCode})
                  </div>
                  <div className="origin-destination">
                    {flight.origin} → {flight.destination}
                  </div>
                  <div className="departure-time">
                    Departs at: {flight.departureTime}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Notification Button */}
      <button
        className="notification-btn"
        onClick={() => setPanelOpen(!panelOpen)}
      >
        <FaBell className="notification-icon" />
        {showNotifications && <span className="notification-dot"></span>}
      </button>

      {/* Notification Panel */}
      {panelOpen && isActive &&(
  <div className="notifications-panel" ref={notificationsRef}>
    <Notifications email={user.email} />
  </div>
)}



      {/* Dark Mode Toggle */}
      <button className="brightness-btn" onClick={toggleBrightness}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      {/* Hamburger Menu */}
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Profile Button */}
      <button
        className="profile-btn"
        onClick={() => {
          const email = "m.ahmadgill01@gmai.com";
          if (isActive && isCustomer) navigate("/consumerProfile", { state: { email } });
          else if (isActive && isProvider) navigate("/providerProfile", { state: { email } });
          else if (isActive) navigate("/adminProfile", { state: { email } });
        }}
      >
        {profileImage && (
          <img
            src={profileImage}
            alt="Profile Preview"
            className="profile-preview"
          />
        )}
      </button>
    </div>
  );
}

export default NveBar;
