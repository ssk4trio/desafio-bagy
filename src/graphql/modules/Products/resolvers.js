const db = require("../../../database/connection");
module.exports = {
    Query: {
        products: async () => await db("products"),

        product: async (_, args) => {
            const product = await (await db("products").where("id", args.id).select("*"))[0];

            return product;
        }
    },

    Mutation: {
        createProduct: async (_, { data }) => {

            const id = await (await db('products').insert(data))[0];

            const product = { id, ...data };

            return product;
        },
        updateProduct: async (_, { id, data }) => {
            await db("products").where("id", id).update(data);

            const product = { id, ...data };

            return product;
        },

        deleteProduct: async(_, { id }) => {
            return db("Products").where("id", id).delete();
        }
    }
}