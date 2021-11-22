
exports.up = function(knex) {
  return knex.schema.createTable("customers", (table) => {
    table.increments("id").primary();
    table.string("email").notNullable().unique();
    table.string("name").notNullable();
    table.string('cpf').notNullable();
    table.date("birthDate").notNullable();
    table.string('street').notNullable();
    table.string('neighborhood').notNullable();
    table.string('city').notNullable();
    table.string('state').notNullable();
    table.string('country').notNullable();
    table.string('zipcode').notNullable();
    table.string('number').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("customers");
};
