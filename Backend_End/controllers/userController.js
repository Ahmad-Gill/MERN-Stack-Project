const { User, UserInformation } = require('../models/User');
const UpcomingEvent = require('../models/UpcomingEvent');
const bcrypt = require('bcryptjs');


exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Successful login
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        customer: user.customer,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// SIGNUP USER
exports.signupUser = async (req, res) => {
  try {
    const { name, email, password, provider, customer } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      provider,
      customer,
    });

    await user.save();

    res.status(201).json({ message: 'Signup successful', user });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: 'Signup error', error: error.message });
  }
};






//User information 
exports.createOrUpdateUser = async (req, res) => {
  console.log(req.body);
  const { email, username, phoneNumber, address, dateOfBirth, gender, country, preferredLanguage, image } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please log in first.' });
    }

    let userInfo = await UserInformation.findOne({ email });

    if (userInfo) {
      userInfo = await UserInformation.findOneAndUpdate(
        { email },
        { username, phoneNumber, address, dateOfBirth, gender, country, preferredLanguage, image },
        { new: true, runValidators: true }
      );
      return res.json({ message: 'User information updated successfully', user: userInfo });
    } else {
      const newUserInfo = new UserInformation({
        email,
        username,
        phoneNumber,
        address,
        dateOfBirth,
        gender,
        country,
        preferredLanguage,
        image
      });
      await newUserInfo.save();
      return res.json({ message: 'User information created successfully', user: newUserInfo });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.getUserInformation = async (req, res) => {
  const { email } = req.query;
  console.log('Request received for email:', email);

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const userInfo = await UserInformation.findOne({ email });
    console.log('UserInfo:', userInfo);

    if (!userInfo) {
      return res.status(401).json({ message: 'User information not found' });
    }

    return res.json({ message: 'User information fetched successfully', user: userInfo });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getUpcomingEventsByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const events = await UpcomingEvent.find({ email }).sort({ testDate: 1, testTime: 1 });
    
    if (events.length === 0) {
      return res.status(404).json({ message: "No upcoming events found for this email." });
    }

    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Server error while fetching events." });
  }
};

