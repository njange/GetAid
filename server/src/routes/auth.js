const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const { pool } = require("../db");
const { ApiError } = require("../middleware/errorHandler");
const { requireAuth } = require("../middleware/auth");
const { COOKIE_NAME, signToken, cookieOptions } = require("../lib/token");

const router = Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_FIELDS = "id, email, name, role";

function setAuthCookie(res, userId) {
  res.cookie(COOKIE_NAME, signToken(userId), cookieOptions);
}

router.post("/auth/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      throw new ApiError(400, "Name is required");
    }
    if (!email || !EMAIL_RE.test(email)) {
      throw new ApiError(400, "A valid email is required");
    }
    if (!password || password.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let result;
    try {
      result = await pool.query(
        `insert into users (email, password_hash, name)
         values ($1, $2, $3)
         returning ${USER_FIELDS}`,
        [email, passwordHash, name.trim()]
      );
    } catch (err) {
      if (err.code === "23505") {
        throw new ApiError(409, "Email already registered");
      }
      throw err;
    }

    const user = result.rows[0];
    setAuthCookie(res, user.id);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
});

router.post("/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    const result = await pool.query(
      `select id, email, name, role, password_hash from users where email = $1`,
      [email]
    );
    const user = result.rows[0];

    if (!user || !user.password_hash) {
      throw new ApiError(401, "Invalid email or password");
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw new ApiError(401, "Invalid email or password");
    }

    delete user.password_hash;
    setAuthCookie(res, user.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

router.post("/auth/google", async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      throw new ApiError(400, "Missing Google credential");
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch {
      throw new ApiError(401, "Invalid Google credential");
    }

    const { sub: googleId, email, name } = payload;

    let result = await pool.query(
      `select ${USER_FIELDS} from users where google_id = $1`,
      [googleId]
    );
    let user = result.rows[0];

    if (!user) {
      result = await pool.query(
        `update users set google_id = $1 where email = $2
         returning ${USER_FIELDS}`,
        [googleId, email]
      );
      user = result.rows[0];
    }

    if (!user) {
      result = await pool.query(
        `insert into users (email, name, google_id)
         values ($1, $2, $3)
         returning ${USER_FIELDS}`,
        [email, name, googleId]
      );
      user = result.rows[0];
    }

    setAuthCookie(res, user.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

router.post("/auth/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.status(204).end();
});

router.get("/auth/me", requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query(
      `select ${USER_FIELDS} from users where id = $1`,
      [req.userId]
    );
    const user = result.rows[0];
    if (!user) {
      throw new ApiError(401, "Not authenticated");
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
