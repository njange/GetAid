exports.up = (pgm) => {
  pgm.createTable("questions", {
    id: "id",
    quiz_id: {
      type: "integer",
      notNull: true,
      references: "quizzes",
      onDelete: "cascade",
    },
    question_text: { type: "text", notNull: true },
    question_type: { type: "text", notNull: true, default: "multiple_choice" },
    options: { type: "jsonb" },
    correct_answer: { type: "text", notNull: true },
    position: { type: "integer", notNull: true, default: 0 },
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

  pgm.addConstraint("questions", "questions_question_type_check", {
    check: "question_type in ('multiple_choice', 'true_false', 'short_answer')",
  });

  pgm.createIndex("questions", "quiz_id");
};

exports.down = (pgm) => {
  pgm.dropTable("questions");
};
