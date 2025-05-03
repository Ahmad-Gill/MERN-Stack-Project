const { User, UserInformation } = require('../models/User');
exports.signup = (req, res) => {
    const { email, password } = req.body;

    const userExists = User.find(user => user.email === email);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    User.push({ email, password });
    res.status(201).json({ message: 'User registered successfully' });
};

exports.signin = (req, res) => {
    const { email, password } = req.body;

    const user = User.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Signed in successfully' });
};
