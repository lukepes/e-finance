const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('auth-token');

  if (!token) {
    const error = new Error('Invalid token, authorization denied');
    error.statusCode = 401;
    throw error;
  }

  try {
    const userData = jwt.verify(token, process.env.jwtSecret);
    req.user = userData.user.id;
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 401;
      error.message = 'Invalid token, authorization denied';
    }
    return next(error);
  }

  return next();
};
