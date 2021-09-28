const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const registerUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, provided data is incorrect');
    error.statusCode = 422;
    return next(error);
  }

  try {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      const error = new Error('User with this email adress already exists');
      error.statusCode = 400;
      return next(error);
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    user = new User({
      email: req.body.email,
      password: password,
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        return res.json({ token });
      }
    );
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal server error';
    }
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, provided data is incorrect');
    error.statusCode = 422;
    return next(error);
  }

  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      const error = new Error(
        'Authentication failed, please check your email and password and try again'
      );
      error.statusCode = 401;
      return next(error);
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      const error = new Error(
        'Authentication failed, please check your email and password and try again'
      );
      error.statusCode = 401;
      return next(error);
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal server error';
    }
    return next(error);
  }
};

exports.registerUser = registerUser;
exports.loginUser = loginUser;
