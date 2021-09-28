const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const Wallet = require('../models/wallet');
const Operation = require('../models/operation');

const getOperation = async (req, res, next) => {
  try {
    const operation = await Operation.findById(req.params.id);

    if (!operation) {
      const error = new Error('Requested operation could not be found');
      error.statusCode = 404;
      throw error;
    }

    const wallet = await Wallet.findOne({
      _id: operation.walletId,
      userId: req.user,
    });

    if (!wallet) {
      const error = new Error('Requested wallet could not be found');
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json(operation);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal server error';
    }
    return next(error);
  }
};

const createOperation = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, provided data is incorrect');
    error.statusCode = 422;
    return next(error);
  }

  try {
    const wallet = await Wallet.findOne({
      _id: req.body.walletId,
      userId: req.user,
    });

    if (!wallet) {
      const error = new Error('Requested wallet could not be found');
      error.statusCode = 404;
      throw error;
    }

    const { walletId, title, type, value } = req.body;

    if (!wallet.allowDebit && type === 'outgoing' && value > wallet.balance) {
      const error = new Error(
        'Incorrect value for a wallet that does not allow debit.'
      );
      error.statusCode = 400;
      throw error;
    }

    let balanceAfterOperation;

    if (type === 'incoming') {
      balanceAfterOperation = wallet.balance + +value;
    } else {
      balanceAfterOperation = wallet.balance - value;
    }

    const newOperation = new Operation({
      walletId,
      title,
      type,
      value,
    });

    wallet.balance = balanceAfterOperation;
    wallet.operations = [...wallet.operations, newOperation.id];

    const session = await mongoose.startSession();
    session.startTransaction();
    await wallet.save({ session });
    await newOperation.save({ session });
    session.commitTransaction();

    return res.status(201).json(newOperation);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal server error';
    }
    return next(error);
  }
};

const updateOperation = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, provided data is incorrect');
    error.statusCode = 422;
    return next(error);
  }

  try {
    const operation = await Operation.findById(req.params.id);

    if (!operation) {
      const error = new Error('Requested operation could not be found');
      error.statusCode = 404;
      throw error;
    }

    const wallet = await Wallet.findOne({
      _id: operation.walletId,
      userId: req.user,
    });

    if (!wallet) {
      const error = new Error('Requested wallet could not be found');
      error.statusCode = 404;
      throw error;
    }

    operation.title = req.body.title;

    await operation.save();

    return res.status(200).json(operation);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal server error';
    }
    return next(error);
  }
};

const deleteOperation = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, provided data is incorrect');
    error.statusCode = 422;
    return next(error);
  }

  try {
    const operation = await Operation.findById(req.params.id);

    if (!operation) {
      const error = new Error('Requested operation could not be found');
      error.statusCode = 404;
      throw error;
    }

    const wallet = await Wallet.findOne({
      _id: operation.walletId,
      userId: req.user,
    });

    if (!wallet) {
      const error = new Error('Requested wallet could not be found');
      error.statusCode = 404;
      throw error;
    }

    if (
      !wallet.allowDebit &&
      operation.type === 'incoming' &&
      wallet.balance < operation.value
    ) {
      const error = new Error('This operation cannot be deleted.');
      error.statusCode = 400;
      throw error;
    }

    if (operation.type === 'incoming') {
      wallet.balance -= operation.value;
    } else {
      wallet.balance += operation.value;
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    await wallet.save({ session });
    await operation.remove({ session });
    session.commitTransaction();

    return res
      .status(200)
      .json({ statusText: 'Operation deleted successfully' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal server error';
    }
    return next(error);
  }
};

exports.getOperation = getOperation;
exports.createOperation = createOperation;
exports.updateOperation = updateOperation;
exports.deleteOperation = deleteOperation;
