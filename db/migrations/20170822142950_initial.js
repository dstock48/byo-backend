
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('states', function(table) {
      table.increments('id').primary();
      table.string('state_name').unique();
      table.string('state_abbreviation').unique();

      table.timestamps(true, true)
    }),

    knex.schema.createTable('resorts', function(table) {
      table.increments('id').primary();
      table.string('resort_name');
      table.string('state_name');
      table.date('projected_open_date');
      table.integer('annual_snowfall').unsigned();
      table.integer('trail_total').unsigned();
      table.integer('days_open_last_year').unsigned();
      table.integer('summit_elevation').unsigned();
      table.integer('base_elevation').unsigned();
      table.decimal('beginner_trail_percent', 4, 3);
      table.decimal('intermediate_trail_percent', 4, 3);
      table.decimal('advanced_trail_percent', 4, 3);
      table.decimal('expert_trail_percent', 4, 3);
      table.integer('states_id').unsigned();
      table.foreign('states_id').references('states.id');

      table.timestamps(true, true)
    }),

    knex.schema.createTable('trails', function(table) {
      table.increments('id').primary();
      table.string('trail_name');
      table.string('trail_difficulty');
      table.decimal('trail_length', 3, 2);
      table.boolean('open');
      table.integer('resort_id').unsigned();
      table.foreign('resort_id').references('resorts.id');

      table.timestamps(true, true)
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('trails'),
    knex.schema.dropTable('resorts'),
    knex.schema.dropTable('states')
  ]);
};
