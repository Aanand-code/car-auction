const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const bidSchema = new Schema(
  {
    bidderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    auctionId: {
      type: Schema.Types.ObjectId,
      ref: 'Auction',
    },
    amount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    isRetracted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

bidSchema.pre('save', function (next) {
  if (typeof this.amount === 'string') {
    this.amount = Number(this.amount);
  }

  if (isNaN(this.amount)) {
    return next(new ApiError(400, 'Bid amount must be valid number'));
  }

  if (typeof this.totalAmount === 'string') {
    this.totalAmount = Number(this.totalAmount);
  }

  if (isNaN(this.totalAmount)) {
    return next(new ApiError(400, 'Bid amount must be valid number'));
  }
  next();
});

const Bid = model('Bid', bidSchema);

module.exports = Bid;
