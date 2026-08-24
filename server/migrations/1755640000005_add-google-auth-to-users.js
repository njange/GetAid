exports.up = (pgm) => {
  pgm.alterColumn("users", "password_hash", { notNull: false });

  pgm.addColumn("users", {
    google_id: { type: "text", unique: true },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("users", "google_id");
  pgm.alterColumn("users", "password_hash", { notNull: true });
};
