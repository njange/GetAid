exports.up = (pgm) => {
  pgm.createTable("quizzes", {
    id: "id",
    lesson_id: {
      type: "integer",
      notNull: true,
      references: "lessons",
      onDelete: "cascade",
    },
    title: { type: "text", notNull: true },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.createIndex("quizzes", "lesson_id");
};

exports.down = (pgm) => {
  pgm.dropTable("quizzes");
};
