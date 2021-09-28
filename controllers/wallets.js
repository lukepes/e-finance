const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const Wallet = require('../models/wallet');
const Operation = require('../models/operation');

const getAllWallets = async (req, res, next) => {
  try {
    const wallets = await Wallet.find({ userId: req.user }).sort({
      name: 'asc',
    });
    return res.status(200).json(wallets);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal server error';
    }
    return next(error);
  }
};

const getSingleWalletData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, provided data is incorrect');
    error.statusCode = 422;
    return next(error);
  }

  try {
    const wallet = await Wallet.findOne(
      {
        _id: req.params.id,
        userId: req.user,
      },
      'name balance allowDebit'
    );

    if (!wallet) {
      const error = new Error('Requested wallet could not be found');
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json(wallet);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal server error';
    }
    return next(error);
  }
};

const getWalletWithOperations = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, provided data is incorrect');
    error.statusCode = 422;
    return next(error);
  }

  try {
    const wallet = await Wallet.findOne({
      _id: req.params.id,
      userId: req.user,
    }).populate('operations', '-walletId');

    if (!wallet) {
      const error = new Error('Requested wallet could not be found');
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json(wallet);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal server error';
    }
    return next(error);
  }
};

const createWallet = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, provided data is incorrect');
    error.statusCode = 422;
    return next(error);
  }

  try {
    const { name, currency, balance, allowDebit } = req.body;

    let wallet = await Wallet.findOne({ name: name, userId: req.user });
    if (wallet) {
      const error = new Error('A wallet with provided name already exists');
      error.statusCode = 400;
      throw error;
    }

    wallet = new Wallet({
      name,
      currency,
      balance,
      allowDebit,
      userId: req.user,
    });

    await wallet.save();

    return res.status(201).json(wallet);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal server error';
    }
    return next(error);
  }
};

const updateWallet = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, provided data is incorrect');
    error.statusCode = 422;
    return next(error);
  }

  try {
    const wallet = await Wallet.findOne({
      _id: req.params.id,
      userId: req.user,
    });

    if (!wallet) {
      const error = new Error('Requested wallet could not be found');
      error.statusCode = 404;
      throw error;
    }

    if (wallet.balance < 0 && !req.body.allowDebit) {
      const error = new Error(
        'Wallet with debit cannot be modified not to allow it'
      );
      error.statusCode = 400;
      throw error;
    }

    wallet.name = req.body.name;
    wallet.allowDebit = req.body.allowDebit;

    await wallet.save();

    return res.status(200).json(wallet);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal server error';
    }
    return next(error);
  }
};

const deleteWalletById = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, provided data is incorrect');
    error.statusCode = 422;
    return next(error);
  }

  try {
    const wallet = await Wallet.findOne({
      _id: req.params.id,
      userId: req.user,
    });

    if (!wallet) {
      const error = new Error('Requested wallet could not be found');
      error.statusCode = 422;
      return next(error);
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    await wallet.remove({ session });
    await Operation.deleteMany({ walletId: wallet._id }, { session });
    session.commitTransaction();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal server error';
    }

    return next(error);
  }

  return res.status(200).json({ statusText: 'Wallet deleted successfully' });
};

exports.getAllWallets = getAllWallets;
exports.getSingleWalletData = getSingleWalletData;
exports.getWalletWithOperations = getWalletWithOperations;
exports.createWallet = createWallet;
exports.updateWallet = updateWallet;
exports.deleteWalletById = deleteWalletById;
