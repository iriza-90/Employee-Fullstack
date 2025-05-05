const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Admin Signup
exports.signup = async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user = await User.create({
      email: req.body.email,
      password: hashedPassword
    });
    res.status(201).json({ message: 'Admin created!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Admin Login
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const validPass = bcrypt.compareSync(req.body.password, user.password);
    if (!validPass) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign(
        { id: user.id }, 
        process.env.JWT_SECRET,
        { expiresIn: '40m' }
      );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout API
exports.logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};