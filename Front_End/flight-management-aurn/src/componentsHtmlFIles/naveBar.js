import React, { useState } from "react";
import "../componentCssFiles/naveBar.scss";
import { FaSearch } from "react-icons/fa";

function NveBar() {
  const [search, setSearch] = useState("");

  const handleType = (event) => {
    setSearch(event.target.value);
    console.log("Typed:", event.target.value);
  };

  return (
    <div className="navBArMain">
      {/* Logo */}
      <div className="logo">
        <img src="/favicon.ico" alt="Logo" />
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Services</a>
        <a href="#">Contact</a>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          className="NaveSearch"
          placeholder="Search"
          value={search}
          onChange={handleType}
        />
        <FaSearch className="search-icon" />
      </div>
    </div>
  );
}

export default NveBar;
