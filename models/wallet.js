const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  allowDebit: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  operations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Operation',
    },
  ],
});

module.exports = mongoose.model('Wallet', walletSchema);
