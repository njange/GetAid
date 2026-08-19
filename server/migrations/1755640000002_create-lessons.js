exports.up = (pgm) => {
  pgm.createTable("lessons", {
    id: "id",
    course_id: {
      type: "integer",
      notNull: true,
      references: "courses",
      onDelete: "cascade",
    },
    title: { type: "text", notNull: true },
    content: { type: "text" },
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

  pgm.createIndex("lessons", "course_id");
};

exports.down = (pgm) => {
  pgm.dropTable("lessons");
};
