require('dotenv').config()
const db = require("../../../database/connection");
const transporter = require("../../../config/email");

async function updateStock (product) {
    const stockProducts = await(await db("products")
        .select("stock")
        .where("id", "=", product.id_product))[0];

    if(stockProducts.stock <= 0 ) {
        console.log("Error, não há mais esse item em estoque");
        return
    }
    stockProducts.stock -= product.quantity;

    await db("products")
        .where("id", product.id_product)
        .update({stock: stockProducts.stock});
}
module.exports = {

    Order: {
        create_at: (order) => {
            return new Date(order.create_at);
        },
    },

    Query: {
        orders: async () => {

            const orders = await db("orders").select('*');
            const products = await db("product_order").select("*");

            for (const order of orders) {
                let productsOfOrder = [];
                for (const product of products) {
                    const id_order = parseInt(product.id_order);

                    if(id_order === order.id) {
                        productsOfOrder.push(product);

                        order.products = productsOfOrder;
                    }
                }
            }
            return orders;
        },
    },

    Mutation: {
        createOrder: async (_, { data }) => {
            const { id_customer, installments, products, status, create_at } = data;

            const id_order = await (await db('orders').insert({ id_customer, installments, status, create_at }))[0];

            for (const product of products) {
                const {quantity, price, id_product } = product;
                const idProductOrder = await db("product_order").insert({ id_order, quantity, price, id_product });

                product.id = idProductOrder[0];

                await updateStock(product);
            }
            const customer = await db("customers").where({id: id_customer})
            console.log(customer)
            const mailOptions = {
                from: process.env.MAIL_USER,
                to: customer.email,
                subject: `
                Seu pedido foi realizado com sucesso ${customer.name}!
                `,
            };
            transporter.sendMail(mailOptions, (err, info) => {
                if(err)
                    console.log(err)
                else
                    console.log(info);
            });
            return { id: id_order, id_customer, installments, status, create_at, products: products };

},
        updateOrder: async (_, { id, data }) => {
            const { id_customer, installments, products, status, create_at } = data;
            const id_order = await db('orders').where("id", id_customer).update({ id_customer, installments, status, create_at });

            for (const product of products) {
                const { quantity, price, id_product } = product;

                product.id_order = id_order;
                product.id = id_product;

                await db("product_order").where("id", id).update({ id_order, quantity, price, id_product });

                await updateStock(product);
            }
            return { id, id_customer, installments, status, create_at, products: products };
        },

        deleteOrder: async (_, id) => {
            return db("product_order").where({ id: id }).delete();
        }
    }
}