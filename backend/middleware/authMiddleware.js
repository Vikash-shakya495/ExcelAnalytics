const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Try to get token from Authorization header or cookies
  let token = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user id & role
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
