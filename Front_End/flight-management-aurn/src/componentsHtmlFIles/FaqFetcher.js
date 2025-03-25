// src/pages/FaqFetcher.jsx
import React, { useEffect, useState } from 'react';

// Dummy FAQ data (simulating API response)
const dummyFaqData = [
  { question: 'How do I book a jet?', answer: 'Simply click on the "Book Now" button and follow the easy steps.' },
  { question: 'What amenities do you offer?', answer: 'We offer luxury seating, gourmet meals, entertainment systems, and more.' },
  { question: 'Can I cancel my booking?', answer: 'Yes, cancellations are allowed within a specified time frame.' },
];

const FaqFetcher = ({ setFaqs }) => {
  useEffect(() => {
    // Simulate fetching data from an API
    setTimeout(() => {
      setFaqs(dummyFaqData); // Pass the data to parent component (Home)
    }, 1000);
  }, [setFaqs]);

};

export default FaqFetcher;
