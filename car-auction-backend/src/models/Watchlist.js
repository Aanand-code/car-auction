const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const watchlistSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  auctionId: {
    type: Schema.Types.ObjectId,
    ref: 'Auction',
  },
});

const Watchlist = model('Watchlist', watchlistSchema);
module.exports = Watchlist;
