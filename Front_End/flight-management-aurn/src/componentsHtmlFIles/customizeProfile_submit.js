export const updateUserProfile = async (userData) => {
    try {
      // Logging the data being sent to the server (for debugging purposes)
      console.log("Data being sent to server:", userData);
      

      // Simulating a network delay to mimic an actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Returning a dummy success response
      return { 
        success: true, 
        type: "success", // Added type for UI handling
        message: "Profile updated successfully!", 
        data: userData 
      };

    } catch (error) {
      // Logging any errors that occur during execution
      console.error("Error updating profile:", error);
      
      // Returning a dummy error response
      return { 
        success: false, 
        type: "error", // Added type for UI handling
        message: "Failed to update profile!" 
      };
    }
};
