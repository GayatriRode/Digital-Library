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

        // Assuming server returns role
        res.status(200).json({ message: 'Login successful', role: user.role });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/logout', async (req, res) => {
  const userId = req.session.userId;

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Update logoutTimes array with new logout time
      const latestLoginDate = user.loginDates[0];
      latestLoginDate.logoutTimes.unshift(new Date());
      await user.save();

      req.session.destroy(err => {
          if (err) {
              return res.status(500).json({ message: 'Error logging out' });
          }
          res.status(200).json({ message: 'Logout successful' });
      });
  } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/customers', async (req, res) => {
  try {
      const customers = await User.find({ role: 'customer' });

      if (!customers) {
          return res.status(404).json({ message: 'No customers found' });
      }

      const customersWithHistory = customers.map(customer => {
          // Map loginDates to extract required fields
          const loginHistory = customer.loginDates.map(dateEntry => ({
              date: dateEntry.date,
              loginTimes: dateEntry.loginTimes,
              logoutTimes: dateEntry.logoutTimes
          }));

          return {
              _id: customer._id,
              name: customer.name,
              phone: customer.phone,
              email: customer.email,
              loginDates: loginHistory
          };
      });

      res.status(200).json(customersWithHistory);
  } catch (error) {
      console.error('Error fetching customers:', error);
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

app.put('/books/:bookId', async (req, res) => {
  const { bookId } = req.params;
  const { name, year, copies, availableCopies, description, price } = req.body;

  try {
    // Find the publisher that contains the book with the given bookId
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

app.post('/books/purchase/:bookId', async (req, res) => {
  const { bookId } = req.params;

  try {
    // Find the publisher that contains the book
    const publisher = await Publisher.findOne({ 'authors.books._id': bookId });

    // Check if the publisher exists
    if (!publisher) {
      return res.status(404).json({ message: 'Publisher not found' });
    }

    let foundBook = null;

    // Loop through authors to find the book and update its availability
    publisher.authors.forEach(author => {
      const book = author.books.find(b => b._id.equals(bookId));
      if (book) {
        foundBook = book;
        // Check if there are available copies to purchase
        if (book.availableCopies > 0) {
          // Decrement availableCopies by 1 and increment purchasedCopies by 1
          book.availableCopies -= 1;
          book.purchasedCopies += 1;
        } else {
          return res.status(400).json({ message: 'No available copies' });
        }
      }
    });

    if (!foundBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Save the updated publisher document
    await publisher.save();

    // Respond with success message and updated book object
    const updatedBook = await Publisher.findOne({ 'authors.books._id': bookId }).select('authors.books.$').exec();
    return res.status(200).json({ message: 'Purchase successful', book: updatedBook.authors[0].books[0] });
    
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error purchasing book:', error);
    return res.status(500).json({ message: 'Error purchasing book', error });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
