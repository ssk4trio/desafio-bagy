exports.up = async function (knex) {
    await knex.raw('PRAGMA foreign_keys = ON');
    return knex.schema.createTable("orders",  (table) => {
        table.increments("id").primary();
        table.date("create_at").defaultTo(knex.fn.now());
        table.integer('installments').notNullable();
        table.uuid("id_customer").references("id").inTable("customers")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        table.string("status").notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("orders");
};
