const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  provider: { type: Boolean, default: false },
  customer: { type: Boolean, default: false }
}, { timestamps: true });


const userInformationSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'], // optional validation
  },
  country: {
    type: String,
  },
  preferredLanguage: {
    type: String,
  },
  image: {
    type: String, // URL or filename of uploaded image
  }
}, { timestamps: true }); // Adds createdAt and updatedAt automatically


module.exports = {
  User: mongoose.model('User', userSchema),
  UserInformation: mongoose.model('userInformation', userInformationSchema)
};
