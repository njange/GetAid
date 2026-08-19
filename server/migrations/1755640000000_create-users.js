exports.up = (pgm) => {
  pgm.createExtension("citext", { ifNotExists: true });

  pgm.createTable("users", {
    id: "id",
    email: { type: "citext", notNull: true, unique: true },
    password_hash: { type: "text", notNull: true },
    name: { type: "text", notNull: true },
    role: { type: "text", notNull: true, default: "student" },
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

  pgm.addConstraint("users", "users_role_check", {
    check: "role in ('student', 'instructor', 'admin')",
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users");
};
