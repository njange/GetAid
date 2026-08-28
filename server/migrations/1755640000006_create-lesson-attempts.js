exports.up = (pgm) => {
  pgm.createTable("lesson_attempts", {
    id: "id",
    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    course_slug: { type: "text", notNull: true },
    lesson_slug: { type: "text", notNull: true },
    completed_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  // Append-only log: rows are inserted per completion attempt and never
  // updated or deleted, so history is preserved for every past attempt.
  pgm.createIndex("lesson_attempts", ["user_id", "course_slug"]);
  pgm.createIndex("lesson_attempts", ["user_id", "course_slug", "lesson_slug"]);
};

exports.down = (pgm) => {
  pgm.dropTable("lesson_attempts");
};
