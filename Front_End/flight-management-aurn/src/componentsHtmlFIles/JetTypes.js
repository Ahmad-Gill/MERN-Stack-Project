import React, { useState, useEffect } from "react";
import "../componentCssFiles/JetTypes.scss";

const JetTypes = () => {
    const [jets, setJets] = useState([
        { id: 1, name: "Cessna Citation M2", description: "A fast and efficient light jet, ideal for short business or leisure trips.", image: "/images/2.png" },
        { id: 2, name: "Hawker 800XP", description: "A midsize jet with excellent range and comfort, perfect for corporate travel.", image: "/images/11.png" },
        { id: 3, name: "Bombardier Challenger 350", description: "A spacious and high-performing super-midsize jet with transcontinental range.", image: "/images/7.png" },
        { id: 4, name: "Gulfstream G450", description: "A heavy jet with luxurious interiors and long-range capabilities for intercontinental travel.", image: "/images/5.png" },
        { id: 5, name: "Dassault Falcon 8X", description: "An ultra-long-range jet offering nonstop global travel with superior efficiency.", image: "/images/14.png" },
        { id: 6, name: "Boeing Business Jet (BBJ)", description: "A VIP airliner with customizable interiors, designed for ultimate luxury and space.", image: "/images/15.png" },
        { id: 7, name: "Pilatus PC-12", description: "A highly efficient turboprop known for its reliability, range, and versatility.", image: "/images/8.png" },
        { id: 8, name: "Airbus H160", description: "A modern helicopter with advanced avionics, ideal for corporate and VIP transport.", image: "/images/17.png" },
        { id: 9, name: "Lockheed Martin F-22 Raptor", description: "A fifth-generation stealth fighter with unmatched agility and speed.", image: "/images/18.png" },
        { id: 10, name: "Boom Supersonic Overture", description: "An experimental supersonic jet designed to revolutionize future air travel.", image: "/images/19.png" }
      ]);
      
  
  const [selectedJet, setSelectedJet] = useState(jets[0]);

  return (
    <div className="jet-container">
      {selectedJet && (
        <div className="jet-preview">
          <img src={selectedJet.image} alt={selectedJet.name} />
        </div>
      )}
      <div className="jet-list">
        {jets.map((jet) => (
          <div
            key={jet.id}
            className="jet-item"
            onClick={() => setSelectedJet(jet)}
          >
            <h3>{jet.name}</h3>
            <hr></hr>
            <p>{jet.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JetTypes;
