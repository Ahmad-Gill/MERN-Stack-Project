export const fetchConsumerHistory = async (email) => {
    console.log(`Fetching booking history for: ${email}`);

    try {
        const response = await fetch(`http://localhost:5000/flight/geetAll`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Received data:', data);

        // Safely extract and filter the flights by email
        const flights = Array.isArray(data.flights) ? data.flights : [];

        const filteredFlights = flights.filter(flight => flight.email === email);
        console.log(filteredFlights)

        return data;

    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
