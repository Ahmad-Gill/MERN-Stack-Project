const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  messages: [
    {
      text: { type: String, required: true }, // Message content
      type: { type: String, enum: ['original', 'response'], required: true }, // Type of the message
      timestamp: { type: Date, default: Date.now } // Timestamp of when the message was sent
    }
  ]
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
