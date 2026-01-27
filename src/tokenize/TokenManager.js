import jwt from 'jsonwebtoken';
import InvariantError from '../exceptions/InvariantError.js';

const TokenManager = {
  generateAccessToken: (payload) => jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_KEY,
    { expiresIn: Number(process.env.ACCESS_TOKEN_AGE) },
  ),

  generateRefreshToken: (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),

  verifyRefreshToken: (refreshToken) => {
    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },

  verifyAccessToken: (accessToken) => {
    try {
      const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
      return payload;
    } catch (error) {
      throw new InvariantError('Access token tidak valid');
    }
  },
};

export default TokenManager;
