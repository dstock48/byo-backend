
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.table('trails', (table) => {
      table.string('resort_name');
    }),
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.table('trails', (table) => {
      table.dropColumn('resort_name');
    }),
  ]);
};
