const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const indexRoutes = require('./routes/index');

const app = express();

const mongoDBSTR = process.env.mongoDBSTR || '';

// Set the strictQuery option to false
mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose.connect(mongoDBSTR, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('MongoDB connected!');
});

db.on('disconnected', () => {
  console.log('MongoDB disconnected! Trying to reconnect...');
  mongoose.connect(mongoDBSTR, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Set up middleware, routes, etc.
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');
app.use('/', indexRoutes);
app.use(express.static('public'));

// middleware to handle invalid GET requests
app.use((req, res, next) => {
  if (req.method === 'GET') {
    // render the default error template
    res.status(404).render('error.ejs');
  } else {
    // pass the request to the next middleware
    next();
  }
});

// Start the server
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  const address = server.address();
  const protocol = address.family === 'IPv6' ? 'http' : 'http'; // or 'https' if using SSL/TLS
  const host = address.address === '::' ? 'localhost' : address.address;
  console.log(`Server listening at ${protocol}://${host}:${address.port}`);
});
