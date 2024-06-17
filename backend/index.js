const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const User = require('./User');
const Publisher = require('./publisher');

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware setup
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));

// MongoDB Connection
const mongoUri = "mongodb+srv://gayatrirode951:kfvO85O2yRbEc34J@cluster0.rt5e03y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
}).then(() => {
  console.log("MongoDB is connected");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

app.post('/signup', async (req, res) => {
  const { name, phone, email, username, password, confirmPassword, role } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, phone, email, username, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful', role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/logout', async (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.status(500).json({ message: 'Error logging out' });
      }
      res.status(200).json({ message: 'Logout successful' });
  });
});

app.get('/api/customer/:customerId', async (req, res) => {
  const customerId = req.params.customerId;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching customer data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin dashboard route
app.get('/admin-dashboard', async (req, res) => {
  const { page = 1, limit = 8 } = req.query;

  try {
    const users = await User.find({ role: 'customer' })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments({ role: 'customer' });

    const formattedUsers = users.map(user => ({
      _id: user._id,
      name: user.name,
      username: user.username,
      password: user.password,
      loginDates: user.loginDates
    }));

    res.status(200).json({ users: formattedUsers, total });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

app.post('/add-book', async (req, res) => {
  try {
    const { publicationHouseName, authorName, name, publishedYear, description, photo, totalCopies, price } = req.body;

    // Validate required fields
    if (!publicationHouseName || !authorName || !name || !publishedYear || !description || !photo || !totalCopies || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create the new book object
    const newBook = {
      name,
      year: publishedYear,
      copies: parseInt(totalCopies),
      availableCopies: parseInt(totalCopies), // Initially all copies are available
      price: parseFloat(price),
      description,
      imageUrl: photo
    };

    // Find or create the publisher
    let publisherDoc = await Publisher.findOne({ name: publicationHouseName });

    if (publisherDoc) {
      // Publisher exists, add book to existing publisher
      publisherDoc.authors.forEach(author => {
        if (author.name === authorName) {
          author.books.push(newBook);
        }
      });
      if (!publisherDoc.authors.find(author => author.name === authorName)) {
        publisherDoc.authors.push({ name: authorName, books: [newBook] });
      }
    } else {
      // Publisher does not exist, create new publisher and add book
      publisherDoc = new Publisher({
        name: publicationHouseName,
        authors: [{ name: authorName, books: [newBook] }]
      });
    }

    // Save the publisher document
    await publisherDoc.save();
    res.status(201).json(publisherDoc);
  } catch (err) {
    console.error("Error adding book:", err);
    res.status(500).json({ error: "Could not add book" });
  }
});

app.get('/books', async (req, res) => {
  try {
    const publishers = await Publisher.find();
    const formattedData = publishers.map(publisher => ({
      name: publisher.name,
      authors: publisher.authors.map(author => ({
        name: author.name,
        books: author.books.map(book => ({
          ...book.toObject()
        }))
      }))
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});

app.put('/books/:id', async (req, res) => {
  const bookId = req.params.id;
  const updatedBookData = req.body; // Ensure this matches your frontend structure

  try {
      // Example: Update book in MongoDB
      const updatedBook = await Book.findByIdAndUpdate(bookId, updatedBookData, { new: true });

      if (!updatedBook) {
          return res.status(404).send({ error: 'Book not found' });
      }

      res.status(200).send(updatedBook);
  } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).send({ error: 'Failed to update book' });
  }
});

app.get('/wishlist', async (req, res) => {
  try {
      const user = await User.findById(req.user.id).populate('wishlist');
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.json(user.wishlist);
  } catch (error) {
      console.error('Error fetching wishlist:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

// Add a book to wishlist
app.put('/wishlist/:bookId', async (req, res) => {
  try {
      const user = await User.findById(req.user.id);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      const bookId = req.params.bookId;
      if (!bookId) {
          return res.status(400).json({ error: 'Book ID is required' });
      }
      if (user.wishlist.includes(bookId)) {
          return res.status(400).json({ error: 'Book already in wishlist' });
      }
      user.wishlist.push(bookId);
      await user.save();
      res.json(user.wishlist);
  } catch (error) {
      console.error('Error adding to wishlist:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

// Purchase a book
app.post('/books/purchase/:bookId', async (req, res) => {
  try {
      const bookId = req.params.bookId;
      // Perform purchase logic here
      res.json({ message: 'Book purchased successfully' });
  } catch (error) {
      console.error('Error purchasing book:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
