const { Router } = require("express");
const { pool } = require("../db");

const router = Router();

router.get("/health", async (req, res, next) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
