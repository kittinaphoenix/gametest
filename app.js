const express = require('express');
const mongoose = require('mongoose');
const indexRoutes = require('./routes/index');
const ip = require('ip');

const reconnectTimeout = 1000;

const app = express();



const mongoDBSTR = process.env.mongoDBSTR || '';

// Set the strictQuery option to false
mongoose.set('strictQuery', false);

// Define a function to connect to MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoDBSTR, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected!');
  } catch (error) {
    console.error('MongoDB connection error: (ignoring message)');
    const actualip = ip.address();
    console.log('mongoDBSTR',mongoDBSTR);
    console.log('Server listening ip:',actualip);
    setTimeout(connectToMongoDB, reconnectTimeout);
  }
};

// Connect to MongoDB
connectToMongoDB();

// Reconnect to MongoDB if disconnected
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected! Trying to reconnect...');
  setTimeout(connectToMongoDB, reconnectTimeout);
});

// Set up middleware, routes, etc.
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
  const actualip = ip.address();
  
  console.log('mongoDBSTR',mongoDBSTR);
  console.log('Server listening ip:',actualip,'protocol:', protocol,'host:', host,'port:',port);
});
