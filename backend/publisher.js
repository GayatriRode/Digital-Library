// backend/models/publisher.js

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  year: { type: Number, required: true, min: 0 },
  copies: { type: Number, required: true, min: 1 },
  availableCopies: { type: Number, required: true, default: function() { return this.copies; } },
  purchasedCopies: { type: Number, default: 0, min: 0 }, 
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  books: [bookSchema]
});

const publisherSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  authors: [authorSchema]
});

bookSchema.index({ name: 1 });
publisherSchema.index({ name: 1 });

// Method to update available copies of a book
bookSchema.methods.updateAvailableCopies = async function(newAvailableCopies) {
  this.availableCopies = newAvailableCopies;
  await this.save();
};

// Ensure 'Publisher' model is only compiled and exported once
module.exports = mongoose.models.Publisher || mongoose.model('Publisher', publisherSchema);
