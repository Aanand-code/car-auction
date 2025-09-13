const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/Car-Auction');
  } catch (err) {
    console.error(err);
  }
}

module.exports = { connectDB };
