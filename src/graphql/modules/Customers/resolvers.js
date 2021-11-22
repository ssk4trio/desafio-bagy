const db = require("../../../database/connection");

module.exports = {
    Customer: {
        birthDate: customer => {
            return new Date(customer.birthDate);
        },
    },

    Query: {
        customers: async () => await db("customers"),

        customer: async (_, args) => {
            const customer = await (await db("customers").where("id",  args.id).select("*"))[0];

            return customer;
        }
    },

    Mutation: {
        createCustomer: async (_, { data }) => {
            const id = await (await db("customers").insert(data))[0];

            const customer = { id, ...data };

            return customer;
          },

        updateCustomer: async (_, { id, data }) => {
            await db("customers").where("id", id).update(data);

            const customer = { id, ...data };

            return customer;
          },

        deleteCustomer: async (_, { id }) => {
            return db("customers").where("id", id).delete();
        }
    }
}