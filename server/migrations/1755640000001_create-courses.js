exports.up = (pgm) => {
  pgm.createTable("courses", {
    id: "id",
    title: { type: "text", notNull: true },
    description: { type: "text" },
    instructor_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
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

  pgm.createIndex("courses", "instructor_id");
};

exports.down = (pgm) => {
  pgm.dropTable("courses");
};
