const User = require('../models/User');


exports.getUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);  // Sends back the list of users
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error fetching users',
        error: error.message
      });
    }
  };

exports.createUser = async (req, res) => {
    try {
        console.log("POST /user route hit");
      // Create a new user instance with the request body data
      const user = new User(req.body);
  
      // Save the user to the database
      await user.save();
  
      // Return a successful response with the user data
      res.status(201).json({
        message: 'User created successfully!',
        user
      });
    } catch (error) {
      // Handle errors (e.g., validation or database issues)
      console.error(error);
      res.status(500).json({
        message: 'Error creating user',
        error: error.message
      });
    }
  };
