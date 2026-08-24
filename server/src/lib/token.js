const jwt = require("jsonwebtoken");

const COOKIE_NAME = "token";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  // Frontend (Vercel) and backend (VPS) are different sites in production,
  // so the cookie needs SameSite=None to be sent on cross-site requests.
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
  maxAge: COOKIE_MAX_AGE_MS,
};

module.exports = { COOKIE_NAME, signToken, verifyToken, cookieOptions };
