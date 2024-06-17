const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: Number, required: true },
  copies: { type: Number, required: true },
  availableCopies: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  books: [bookSchema]
});

const publisherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  authors: [authorSchema]
});

const Publisher = mongoose.model('Publisher', publisherSchema);

module.exports = Publisher;
