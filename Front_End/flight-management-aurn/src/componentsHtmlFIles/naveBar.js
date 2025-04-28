import React, { useState, useRef, useEffect } from "react";
import "../componentCssFiles/naveBar.scss";
import { FaSearch, FaBars, FaTimes, FaSun, FaMoon, FaBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Notifications from "../componentsHtmlFIles/Notifications"; 
import fetchData from "../componentsHtmlFIles/SearchPage"; 
import { useUser } from "../componentsHtmlFIles//UserContext";
import { setName, setEmail, setActiveStatus, setCustomerStatus, setProviderStatus, resetUser } from "../store";
import { useSelector, useDispatch } from "react-redux";

function NveBar() {
  const dispatch = useDispatch();
    const user = useSelector((state) => state.user);       //REdux comands
  
    const { isActive, isCustomer, isProvider } = useSelector((state) => state.user);
  
  const [search, setSearch] = useState("");
  const { profileImage } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const navigate = useNavigate();

  const searchRef = useRef(null);            //USe to close the panels when i click on anywhere on screen
  const notificationsRef = useRef(null);

  const handleType = async (e) => {
    const query = e.target.value.trim();
    setSearch(query);
    setError(null);
  
    if (query !== "") {
      setLoading(true);
      try {
        const data = await fetchData(query);
        if (typeof data === "string") {
          setResults(["Something went wrong. Please try again."]);
          setError(data); // Show "No data available" message
        } else {
          setResults(data);
          setError(null);
        }
      } catch (error) {
        setError("Something went wrong. Please try again.");
        setResults(["Something went wrong. Please try again."]);
      } finally {
        setLoading(false);
      }
    } else {
      setResults(["Something went wrong. Please try again."]);
      setError(null);
    }
  };
  

  const toggleBrightness = () => {          // Change Theme Color
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  useEffect(() => {          // Auto Triger   to clse the notification and search panels 
    const handleClickOutside = (event) => {
      if (
        (searchRef.current || !searchRef.current.contains(event.target)) ||
        (notificationsRef.current || !notificationsRef.current.contains(event.target))
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


  // ---------------------------------------MAIN NAVE BAR CODE --------------------------------
  return (
    <div className="navBArMain">

      {/* Logo  */}
          <div className="logo">
            <Link to="/">
              <img src="/favicon.ico" alt="Logo" />
            </Link>
          </div>
      {/* NAVIGATION LINKS */}
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            {isCustomer && isActive && (
  <Link to="/Analytics_consumer" onClick={() => setMenuOpen(false)}>
    Analytics
  </Link>
)}
 {isProvider && isActive && (
  <Link to="/Analytics_provider" onClick={() => setMenuOpen(false)}>
    Analytics
  </Link>
)}
 {isProvider && isActive && (
  <Link to="/UpcomingFlights_provider" onClick={() => setMenuOpen(false)}>
    Flights
  </Link>
)}


{isCustomer && isActive && (
  <Link to="/flights" onClick={() => setMenuOpen(false)}>Flights</Link>
)}
{!isCustomer && isActive && !isProvider &&(
  <Link to="/AnalyticsAdmin" onClick={() => setMenuOpen(false)}>Analytics</Link>
)}
{!isCustomer && isActive && !isProvider &&(
  <Link to="/UpcomingFlights_admin" onClick={() => setMenuOpen(false)}>Flights Heandling</Link>
)}

{!isCustomer && isActive && !isProvider &&(
  <Link to="/AdminChart" onClick={() => setMenuOpen(false)}>Quries</Link>
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
  <Link to="/auth" onClick={() => setMenuOpen(false)}>LogIn</Link>
)}


          </div>
      {/* Search COntainer */}
          <div className="search-container" ref={searchRef}>
              <div className="search-box">
                <input className="NaveSearch" placeholder="Search Flights " value={search} onChange={handleType} />
                <FaSearch className="search-icon" />
              </div>
              {/* Show Search Result */}
              {results.length > 0 && (
                <div className="search-results-container">
                  <ul className="search-results">
                    {results.map((item, index) => (
                      <li key={index}>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          {item.name || "Untitled Result"}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
      {/* Notification Center */}
            <button className="notification-btn" onClick={() => setPanelOpen(!panelOpen)}>
              <FaBell className="notification-icon" />
              {showNotifications && <span className="notification-dot"></span>}
            </button>
      {/* Show Notification  */}
            {panelOpen && <div className="notifications-panel" ref={notificationsRef}><Notifications /></div>}
      {/* Dark Mode Switch */}
            <button className="brightness-btn" onClick={toggleBrightness}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
      {/* HAmburger model  */}
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
      {/* User Profile  */}
      <button 
  className="profile-btn" 
  onClick={() => {
    if (isActive && isCustomer ) {
      navigate("/consumerProfile", { state: { email: "m.ahmadgill01@gmai.com" } });
    } else if (isActive && isProvider) {
      navigate("/providerProfile", { state: { email: "m.ahmadgill01@gmai.com" } });
    } else if (isActive && !isProvider && !isCustomer) {
      navigate("/adminProfile", { state: { email: "m.ahmadgill01@gmai.com" } });
    }
  }}
>
  {profileImage && <img src={profileImage} alt="Profile Preview" className="profile-preview" />}
</button>

    </div>
  );
}

export default NveBar;
