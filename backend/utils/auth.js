import jwt from 'jsonwebtoken';

export const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production' || !!process.env.FRONTEND_URL;
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'strict',
    maxAge: 60 * 60 * 24 * 1000 // 1 day in ms
  };
};
export const verifyAdminAuth = (req) => {
  let token = req.cookies?.admin_token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) return { authenticated: false, error: 'No token provided' };
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET missing');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return { authenticated: false, error: 'Not an admin' };
    return { authenticated: true, user: decoded };
  } catch (error) {
    return { authenticated: false, error: 'Invalid token' };
  }
};

export const verifyUserAuth = (req, res, next) => {
  let token = req.cookies?.user_token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET missing');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
