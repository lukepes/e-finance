const express = require('express');
const { body, param } = require('express-validator');

const auth = require('../middleware/auth');

const operationsController = require('../controllers/operations');

const router = express.Router();

// @Route     GET /operations/:id
// @dsc       Get single operation
// @access    Private
router.get(
  '/:id',
  auth,
  [param('id').isString().trim().escape().isLength({ max: 24, min: 24 })],
  operationsController.getOperation
);

// @Route     POST /operations
// @dsc       Create a new operation
// @access    Private
router.post(
  '/',
  auth,
  [
    body('walletId').isString().isLength({ max: 24, min: 24 }),
    body('title').isString().trim().escape().isLength({ max: 24 }),
    body('type').isString().trim().escape(),
    body('value').trim().escape().isNumeric(),
  ],
  operationsController.createOperation
);

// @Route     PATCH /operations/:id
// @dsc       Update operation name
// @access    Private
router.patch(
  '/:id',
  auth,
  [
    param('id').isString().trim().escape().isLength({ max: 24, min: 24 }),
    body('title').isString().trim().escape().isLength({ max: 24 }),
  ],
  operationsController.updateOperation
);

// @Route     DELETE /operations
// @dsc       Delete operation
// @access    Private
router.delete(
  '/:id',
  auth,
  [param('id').isString().trim().escape().isLength({ max: 24, min: 24 })],
  operationsController.deleteOperation
);

module.exports = router;
