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
            const { cpf, email } = data;

            const cpfRegisted = await (db("customers").select("cpf").where('cpf', cpf))[0];
            const emailRegisted = await (db("customers").select("cpf").where('email', email))[0];

            if(cpfRegisted) {
                throw new Error(`${cpf} já cadastrado`);
            }

            if(emailRegisted) {
                throw new Error(`${email} já cadastrado`);
            }

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