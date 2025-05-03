const Stripe = require('stripe');
const stripe = Stripe('sk_test_51RKllIRj51clcxJQMUbLVsCqteIP1BrsaOB2GwqbMOw6vqkqIUwjayUqKw9mfZDJd3p4zdpxYeQbYeRIyxwiD58j006h4DOgc9'); // Replace with your Stripe secret key

const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, payment_method } = req.body;

    // Log all received data to debug
    console.log(`Received data: Amount - ${amount}, Currency - ${currency}, Payment Method - ${payment_method}`);

    if (!payment_method) {
      console.log("Payment method is missing in the request.");
      return res.status(400).json({ message: "Payment method is required." });
    }

    // Validate incoming data
    if (!amount || !currency) {
      console.log("Missing amount or currency");
      return res.status(400).json({ message: "Amount and currency are required." });
    }

    if (isNaN(amount) || amount <= 0) {
      console.log("Invalid amount:", amount);
      return res.status(400).json({ message: "Invalid amount provided." });
    }

    const validCurrencies = ['usd', 'eur', 'gbp'];
    if (!validCurrencies.includes(currency.toLowerCase())) {
      console.log("Invalid currency:", currency);
      return res.status(400).json({ message: "Invalid currency provided." });
    }

    // Create the payment intent with Stripe API
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency,
      payment_method,
      confirm: true, // Automatically confirm the payment intent (to capture the payment immediately)
      capture_method: 'automatic', // Automatically capture the payment
      return_url: 'http://localhost:3000/flights',
    });

    console.log('Payment Intent created:', paymentIntent);

    res.status(200).json({
      message: 'Payment successful!',
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    let errorMessage = "Payment intent creation failed.";
    if (error.type === 'StripeCardError') {
      errorMessage = `Card error: ${error.message}`;
    } else if (error.type === 'StripeRateLimitError') {
      errorMessage = "Rate limit error: Too many requests made to the API too quickly.";
    } else if (error.type === 'StripeInvalidRequestError') {
      errorMessage = `Invalid request error: ${error.message}`;
    } else if (error.type === 'StripeAPIError') {
      errorMessage = `API error: ${error.message}`;
    } else if (error.type === 'StripeConnectionError') {
      errorMessage = `Connection error: ${error.message}`;
    }

    res.status(500).json({ message: errorMessage, error: error.message });
  }
};

module.exports = { createPaymentIntent };
