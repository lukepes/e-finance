const express = require('express');
const { body, param, query } = require('express-validator');

const auth = require('../middleware/auth');

const walletsController = require('../controllers/wallets');

const router = express.Router();

// @Route     GET /wallets
// @dsc       Get user's all wallets
// @access    Private
router.get('/', auth, walletsController.getAllWallets);

// @Route     GET /wallets/:id
// @dsc       Get user's single wallet
// @access    Private
router.get(
  '/:id',
  auth,
  [param('id').isString().trim().escape().isLength({ max: 24, min: 24 })],
  walletsController.getSingleWalletData
);

// @Route     GET /wallets/:id/operations
// @dsc       Get operations connected to the wallet
// @access    Private
router.get(
  '/:id/operations',
  auth,
  [param('id').isString().trim().escape().isLength({ max: 24, min: 24 })],
  walletsController.getWalletWithOperations
);

// @Route     POST /wallets
// @dsc       Create a new wallet
// @access    Private
router.post(
  '/',
  auth,
  [
    body('name').trim().escape().not().isEmpty(),
    body('currency')
      .trim()
      .escape()
      .custom((value) => value === 'pln' || value === 'usd' || value === 'eur'),
    body('balance').trim().escape().isNumeric(),
    body('allowDebit').isBoolean(),
  ],
  walletsController.createWallet
);

// @Route     PATCH /wallets/:id
// @dsc       Update user's wallet
// @access    Private
router.patch(
  '/:id',
  auth,
  [
    body('name').trim().escape().not().isEmpty(),
    body('allowDebit').isBoolean(),
    param('id').isString().trim().escape().isLength({ max: 24, min: 24 }),
  ],
  walletsController.updateWallet
);

// @Route     DELETE /wallets
// @dsc       Delete user's wallet
// @access    Private
router.delete(
  '/:id',
  auth,
  [param('id').isString().trim().escape().isLength({ max: 24, min: 24 })],
  walletsController.deleteWalletById
);

module.exports = router;
