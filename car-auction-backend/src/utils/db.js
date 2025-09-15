const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
  } catch (err) {
    console.error(err);
  }
}

module.exports = { connectDB };
