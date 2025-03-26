import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import "../componentCssFiles/PlaneLoading.scss";

const PlaneLoading = ({ isLoading }) => {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        fetch("/3.json") // Load from public folder
            .then((response) => response.json())
            .then((data) => setAnimationData(data))
            .catch((error) => console.error("Error loading animation:", error));
    }, []);

    if (!isLoading || !animationData) return null; // Hide if not loading

    return (
        <div className="plane-loading-container">
            <Lottie animationData={animationData} loop={true} className="plane-animation" />
        </div>
    );
};

export default PlaneLoading;
