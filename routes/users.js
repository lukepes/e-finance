const express = require('express');
const { body } = require('express-validator');

const usersController = require('../controllers/users');

const router = express.Router();

// @Route     POST /users/register
// @dsc       Registers a new user
// @access    Public
router.post(
  '/register',
  [
    body('email').isEmail().trim().escape(),
    body('password').isString().trim().escape().isLength({ min: 6 }),
  ],
  usersController.registerUser
);

// @Route     POST /users/login
// @dsc       Registers a new user
// @access    Public
router.post(
  '/login',
  [
    body('email').isEmail().trim().escape(),
    body('password').isString().trim().escape().isLength({ min: 6 }),
  ],
  usersController.loginUser
);

module.exports = router;
