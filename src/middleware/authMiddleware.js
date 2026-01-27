import TokenManager from '../tokenize/TokenManager.js';
import AuthenticationError from '../exceptions/AuthenticationError.js';

const authMiddleware = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Token tidak valid');
    }

    const token = authorizationHeader.split(' ')[1];
    const payload = TokenManager.verifyAccessToken(token);

    req.auth = payload;
    return next();
  } catch (error) {
    return next(new AuthenticationError('Token tidak valid'));
  }
};

export default authMiddleware;
