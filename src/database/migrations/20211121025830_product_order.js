
exports.up = async function (knex) {
  await knex.raw('PRAGMA foreign_keys = ON');
  return knex.schema.createTable("product_order",  (table) => {
    table.increments("id").primary();
    table.uuid("id_product").references("id")
        .inTable("products")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    table.uuid("id_order").references("id")
        .inTable("orders")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    table.integer('quantity');
    table.float("price", 12, 2);
  })


};

exports.down = function(knex) {
  return knex.schema.dropTable("product_order");
};
