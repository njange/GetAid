const { ApiError } = require("./errorHandler");
const { COOKIE_NAME, verifyToken } = require("../lib/token");

function requireAuth(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    return next(new ApiError(401, "Not authenticated"));
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.sub;
    next();
  } catch {
    next(new ApiError(401, "Not authenticated"));
  }
}

module.exports = { requireAuth };
