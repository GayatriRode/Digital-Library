const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const User = require('./User');
const Publisher = require('./Publisher');
const Order = require('./Order');
const Inquiry = require('./Inquiry');

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
  console.log("Received data:", req.body);

  try {
    const { name, phone, email, username, password, role } = req.body;

    // Hash password before saving to database
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      phone,
      email,
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error("Error creating user:", err); // Log detailed error
    res.status(500).json({ error: "Could not create user" });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }); // Find user using User model
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    // Append the new login time
    user.loginDates.push({ loginTime: Date.now() });
    await user.save();

    // Retrieve the userType from the database (assuming you have a 'role' field in your User schema)
    const userType = user.role;

    res.json({ message: "Login successful", userType, userId: user._id }); // Send back user ID for frontend use
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/api/logout', async (req, res) => {
  const { customerId, loginDateIndex } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(customerId);
    if (!user || user.role !== 'customer') {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Add logout time to the specified loginDate entry
    const logoutTime = new Date();
    user.loginDates[loginDateIndex].logoutTimes.push(logoutTime);

    // Save user with updated logout time
    await user.save();

    // Respond with logout time to update frontend state
    res.status(200).json({ logoutTime });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/customers/:id/times
app.put('/api/customers/:id/times', async (req, res) => {
  const { id } = req.params;
  const { loginDates, logoutTimes } = req.body;

  try {
    const customer = await User.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.loginDates = loginDates.map((loginDate, index) => ({
      ...loginDate,
      logoutTimes: logoutTimes[index] || [],
    }));

    await customer.save();
    res.status(200).json(customer);
  } catch (error) {
    console.error('Error updating times:', error);
    res.status(500).json({ message: 'Internal server error' });
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

app.post('/purchase', async (req, res) => {
  const { userId, bookId, copies } = req.body;

  try {
    // Ensure copies is a valid number
    const numCopies = Number(copies);
    if (isNaN(numCopies) || numCopies <= 0) {
      return res.status(400).json({ error: 'Invalid number of copies' });
    }

    // Fetch book details
    const publisher = await Publisher.findOne({ 'authors.books._id': bookId });
    
    if (!publisher) {
      return res.status(404).json({ error: 'Publisher not found' });
    }

    let foundBook;
    publisher.authors.forEach(author => {
      author.books.forEach(book => {
        if (book._id.toString() === bookId) {
          foundBook = book;
        }
      });
    });

    if (!foundBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Check if there are enough available copies
    if (foundBook.availableCopies < numCopies) {
      return res.status(400).json({ error: 'Not enough available copies' });
    }

    // Deduct available copies and validate
    const updatedCopies = foundBook.availableCopies - numCopies;
    if (isNaN(updatedCopies) || updatedCopies < 0) {
      return res.status(400).json({ error: 'Invalid available copies value' });
    }
    foundBook.availableCopies = updatedCopies;
    await publisher.save();

    // Fetch customer details from User model
    const customer = await User.findById(userId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Create order
    const order = new Order({
      customer: userId,
      book: foundBook._id,
      customerName: customer.name,
      customerNumber: customer.phone,
      customerEmail: customer.email,
      price: foundBook.price * numCopies,
      copiesPurchased: numCopies
    });

    await order.save();

    res.status(200).json({ message: 'Purchase completed successfully', book: foundBook });
  } catch (error) {
    console.error('Error purchasing book:', error);
    res.status(500).json({ error: 'Failed to complete purchase' });
  }
});

app.get('/books', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const publishers = await Publisher.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('authors.books');

    res.json(publishers);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

app.put('/books/:bookId', async (req, res) => {
  const { bookId } = req.params;
  const { name, year, copies, availableCopies, description, price } = req.body;

  try {
    const publisher = await Publisher.findOne({ 'authors.books._id': bookId });

    if (!publisher) {
      return res.status(404).json({ error: 'Publisher not found' });
    }

    // Find the author containing the book
    let foundBook = null;
    let foundAuthor = null;
    publisher.authors.forEach(author => {
      author.books.forEach(book => {
        if (book._id.toString() === bookId) {
          foundBook = book;
          foundAuthor = author;
        }
      });
    });

    if (!foundBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Update the book fields
    foundBook.name = name;
    foundBook.year = year;
    foundBook.copies = copies;
    foundBook.availableCopies = availableCopies;
    foundBook.description = description;
    foundBook.price = price;

    // Save the updated publisher
    await publisher.save();

    res.json({ message: 'Book updated successfully', book: foundBook });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

app.delete('/books/:bookId', async (req, res) => {
  const { bookId } = req.params;

  try {
    // Convert bookId to ObjectId
    const objectId = new mongoose.Types.ObjectId(bookId);

    // Find the publisher containing the book to be deleted
    const publisher = await Publisher.findOne({ 'authors.books._id': objectId });

    if (!publisher) {
      return res.status(404).json({ error: 'Publisher or book not found' });
    }

    // Update the publisher document to remove the book
    await Publisher.updateOne(
      { 'authors.books._id': objectId },
      { $pull: { 'authors.$[].books': { _id: objectId } } }
    );

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

app.get('/api/customers', async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }); // Fetch customers based on role 'customer'
    res.json(customers);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('customer', 'name email phone').exec();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/:customerId', async (req, res) => {
  const { customerId } = req.params;

  try {
    // Validate customer ID against database
    const user = await User.findById(customerId);
    if (!user) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Fetch orders for the validated customer
    const orders = await Order.find({ customer: customerId }).populate('book', 'title author'); // Populate book details
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders. Please try again later.' });
  }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newInquiry = new Inquiry({
      name,
      email,
      message,
      createdAt: new Date()
    });

    await newInquiry.save();

    res.status(201).json({ message: 'Inquiry form submitted successfully' });
  } catch (err) {
    console.error('Error submitting inquiry:', err);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
