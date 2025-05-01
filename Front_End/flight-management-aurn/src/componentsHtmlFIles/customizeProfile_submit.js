export const updateUserProfile = async (userData) => {
  try {
    // Logging the data being sent to the server (for debugging purposes)
    console.log("Data being sent to server:", userData);

    // Sending the updated user data to the server via a POST request
    const response = await fetch('http://localhost:5000/user/updateUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Checking if the response is successful
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    // Parsing the response JSON
    const data = await response.json();
    console.log('Server response:', data);

    // Returning the success response with the necessary information
    return {
      success: true,
      type: "success", // UI handling type
      message: data.message || "Profile updated successfully!", // Message from the server
      data: userData, // Updated user data
    };

  } catch (error) {
    // Logging any errors that occur during the request
    console.error("Error updating profile:", error);

    // Returning a failure response with the error message
    return {
      success: false,
      type: "error", // UI handling type
      message: error.message || "Failed to update profile!", // Error message
    };
  }
};
