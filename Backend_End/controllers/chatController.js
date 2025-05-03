const Chat = require('../models/Chat');
const UpcomingEvent = require('../models/UpcomingEvent');

// Send or add a new message
exports.addMessage = async (req, res) => {
  const { email, message, type } = req.body; // Added 'type' for message type

  if (!email || !message || !type) {
    return res.status(400).json({ message: 'Email, message, and type are required.' });
  }

  if (!['original', 'response'].includes(type)) {
    return res.status(400).json({ message: 'Invalid message type. Must be "original" or "response".' });
  }

  try {
    // Find existing chat by email
    let chat = await Chat.findOne({ email });

    if (!chat) {
      // If no chat exists, create a new one
      chat = new Chat({ email, messages: [{ text: message, type, timestamp: Date.now() }] });
    } else {
      // If chat exists, push new message
      chat.messages.push({ text: message, type, timestamp: Date.now() });
    }

    await chat.save();
    res.status(200).json({ message: 'Message saved successfully.', chat });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get all messages for a user
exports.getMessages = async (req, res) => {
  const { email } = req.params;

  try {
    const chat = await Chat.findOne({ email });

    if (!chat) {
      return res.status(404).json({ message: 'No chat found for this email.' });
    }

    res.status(200).json({ messages: chat.messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
