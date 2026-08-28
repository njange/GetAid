const { Router } = require("express");
const { pool } = require("../db");
const { ApiError } = require("../middleware/errorHandler");
const { requireAuth } = require("../middleware/auth");

const router = Router();

router.use(requireAuth);

// Per-user, per-lesson completion state, derived from the append-only
// attempt log: a lesson is "complete" once it has at least one attempt.
router.get("/progress", async (req, res, next) => {
  try {
    const result = await pool.query(
      `select course_slug, lesson_slug,
              count(*)::int as attempts,
              max(completed_at) as last_completed_at
         from lesson_attempts
        where user_id = $1
        group by course_slug, lesson_slug
        order by course_slug, lesson_slug`,
      [req.userId]
    );

    res.json({
      progress: result.rows.map((row) => ({
        courseSlug: row.course_slug,
        lessonSlug: row.lesson_slug,
        attempts: row.attempts,
        lastCompletedAt: row.last_completed_at,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// Full attempt history for a single lesson, most recent first.
router.get("/progress/lessons/:courseSlug/:lessonSlug", async (req, res, next) => {
  try {
    const { courseSlug, lessonSlug } = req.params;

    const result = await pool.query(
      `select id, completed_at
         from lesson_attempts
        where user_id = $1 and course_slug = $2 and lesson_slug = $3
        order by completed_at desc`,
      [req.userId, courseSlug, lessonSlug]
    );

    res.json({
      completed: result.rows.length > 0,
      attempts: result.rows.map((row) => ({
        id: row.id,
        completedAt: row.completed_at,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// Records a new completion attempt. Always inserts — past attempts are
// never overwritten, so repeat completions build up a full history.
router.post("/progress/lessons/:courseSlug/:lessonSlug/complete", async (req, res, next) => {
  try {
    const { courseSlug, lessonSlug } = req.params;
    if (!courseSlug.trim() || !lessonSlug.trim()) {
      throw new ApiError(400, "Course and lesson are required");
    }

    const result = await pool.query(
      `insert into lesson_attempts (user_id, course_slug, lesson_slug)
       values ($1, $2, $3)
       returning id, completed_at`,
      [req.userId, courseSlug, lessonSlug]
    );

    const attempt = result.rows[0];
    res.status(201).json({
      attempt: { id: attempt.id, completedAt: attempt.completed_at },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
