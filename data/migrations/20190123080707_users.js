
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', tbl => {

    // Primary key
    tbl.increments();

    // Other keys

    tbl.string('password').notNullable();
    tbl.string('username', 60).unique().notNullable();
    tbl.string('department', 60).notNullable();

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
