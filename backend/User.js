const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, match: /^[789]\d{9}$/ },
  email: { type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/ },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  loginDates: [{
    loginTime: { type: Date, default: Date.now },
    logoutTimes: [{ type: Date }],
  }],
});

module.exports = mongoose.model('User', userSchema);
