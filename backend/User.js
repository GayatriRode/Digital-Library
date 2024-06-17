const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    username: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['admin', 'customer'] },
    loginDates: [
        {
          date: { type: Date, required: true },
          loginTimes: [{ type: Date }],
          logoutTimes: [{ type: Date }],
        },
      ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    purchases: [{
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
        bookName: String,
        author: String,
        price: Number,
        purchaseDate: { type: Date, default: Date.now }
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
