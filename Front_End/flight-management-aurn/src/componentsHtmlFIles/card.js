import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import Popup from "../componentsHtmlFIles/Popup";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51RKllIRj51clcxJQKlJ8jxTtd0JXBv0xeiJQEtJyhGxwoLyXTQHTzqp6nOeLL3nbMWJGsSLS7o6jrx1KQxXY5xTz00dXQe3bF4");

function PaymentForm({ row, onClose }) {
  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const socketRef = useRef(null);

  useEffect(() => {
    // Establish WebSocket connection
    socketRef.current = new WebSocket("ws://localhost:5000/ws");

    socketRef.current.onopen = () => console.log("WebSocket connected");

    socketRef.current.onmessage = (event) => {
    };

    socketRef.current.onerror = (error) => {
    };

    socketRef.current.onclose = () => console.log("WebSocket connection closed");

    // Clean up WebSocket connection on component unmount
    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    if (!stripe || !elements) return;
  
    const cardElement = elements.getElement(CardElement); // Get the card element
  
    if (!cardElement) {
      showError("Card element is missing.");
      return;
    }
  
    try {
      // Create payment method using stripe.createPaymentMethod
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
  
      if (error) {
        showError(error.message); // If there is an error, show the error message
        console.error('[Error]', error);
        return;
      }
  
      // If paymentMethod is created successfully, proceed with the API call to backend
      console.log("paymentMethod created:", paymentMethod); // Log the payment method for debugging
  
      const response = await fetch('http://localhost:5000/payments/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 1000,  // Your amount
          currency: 'usd',  // Your currency
          payment_method: paymentMethod.id,  // Send the payment method ID to the backend
        }),
      });
  
      const data = await response.json();  // Parse response from backend
      console.log('Backend response:', data);
  
      if (data.success) {
        showSuccess("Payment successful!");  // Show success message if payment is successful
        setPopupType("success")
      } else {
        showSuccess("Payment successful!");
      }
    } catch (error) {
      showError("Payment failed. Check console.");
    }
  };
  
  const showError = (msg) => {
    setPopupMessage(msg);
    setPopupType("error");
  };

  const showSuccess = (msg) => {
    setPopupMessage(msg);
    setPopupType("success");
  };
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Enter Payment Details</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.cardElementWrapper}>
            <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
          </div>
          <button type="submit" style={styles.button}>Submit Payment</button>
          <button type="button" onClick={onClose} style={styles.cancel}>Cancel</button>
        </form>
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
    </div>
  );
}

function PaymentModal({ row, onClose }) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm row={row} onClose={onClose} />
    </Elements>
  );
}

export function handlePaymentDetails(row) {
  const modalContainer = document.createElement("div");
  document.body.appendChild(modalContainer);
  const root = ReactDOM.createRoot(modalContainer);

  const closeModal = () => {
    root.unmount();
    document.body.removeChild(modalContainer);
  };

  root.render(<PaymentModal row={row} onClose={closeModal} />);
}

// Styles
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 8,
    width: 300,
    boxShadow: "0 0 10px rgba(0,0,0,0.25)",
  },
  cardElementWrapper: {
    padding: "10px",
    border: "1px solid #ccc",
    marginBottom: 12,
    borderRadius: 4,
  },
  button: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    cursor: "pointer",
    width: "100%",
    marginBottom: 8,
  },
  cancel: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    cursor: "pointer",
    width: "100%",
  },
};
