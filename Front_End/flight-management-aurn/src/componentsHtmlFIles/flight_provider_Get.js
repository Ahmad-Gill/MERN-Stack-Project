export const fetchConsumerHistory = async (email) => {
    console.log(`Fetching history for: ${email}`);

    try {
        const response = await fetch(`http://localhost:5000/flight/getAddedFlights?email=${email}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json(); // Parse the JSON response
        return data;

    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return empty array in case of an error
    }
};
