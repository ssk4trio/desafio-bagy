
exports.up = function(knex) {
  return knex.schema.createTable("products", (table)=> {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("image_url").notNullable();
    table.string('description').notNullable();
    table.float("weight", 5, 2).notNullable();
    table.decimal('price', 12,2).notNullable();
    !table.integer('stock').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("products");
};
