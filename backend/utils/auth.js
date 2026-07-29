import jwt from 'jsonwebtoken';

export const verifyAdminAuth = (req) => {
  const token = req.cookies?.admin_token;
  if (!token) return { authenticated: false, error: 'No token provided' };
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod');
    if (decoded.role !== 'admin') return { authenticated: false, error: 'Not an admin' };
    return { authenticated: true, user: decoded };
  } catch (error) {
    return { authenticated: false, error: 'Invalid token' };
  }
};

export const verifyUserAuth = (req, res, next) => {
  const token = req.cookies?.user_token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
