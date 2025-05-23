const mongoose = require('mongoose');

// Connection function to MongoDB
const connectDB = async () => {
  try {
    // Connect to MongoDB Atlas or local MongoDB server
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 45000,
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with failure if the connection fails
  }
};

module.exports = connectDB;
