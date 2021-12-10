require('dotenv').config()
const db = require("../../../database/connection");
const transporter = require("../../../config/email");

async function totalPrice(products) {
    let total = 0;
    for (const product of products) {
        const { price } = await (await db("products").select("price").where("id", product.id_product))[0];
        total += price * product.quantity;
    }
    return total;
}

async function checkStock(products) {
    for (const product of products) {
        const { stock, name } = await (await db("products").select("stock", "name").where("id", product.id_product))[0];
        if(stock < product.quantity) {
            throw new Error(`Quantidade do produto ${name} em estoque é inferior a quantidade desejada. EM ESTOQUE: ${stock}`)
        }
    }
}

async function updateStock (product) {
    const stockProducts = await(await db("products")
        .select("stock")
        .where("id", "=", product.id_product))[0];

    stockProducts.stock -= product.quantity;

    await db("products")
        .where("id", product.id_product)
        .update({stock: stockProducts.stock});

    return stockProducts.stock;
}

module.exports = {

    Order: {
        price: (order) => {
            return totalPrice(order.products);
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
            console.log(orders)
            return orders;
        },
    },

    Mutation: {
        createOrder: async (_, { data }) => {
            const { id_customer, installments, products, status } = data;

            await checkStock(products);

            const id_order = await (await db('orders').insert({ id_customer, installments, status }))[0];
            const { create_at } = await (await db('orders').select("create_at").where("id", id_order))[0];

            for (const product of products) {
                const { quantity, price, id_product } = product;
                await updateStock(product);
                const idProductOrder = await db("product_order").insert({ id_order, quantity, price, id_product });

                product.id = idProductOrder[0];
            }
            const customer = await (await db("customers").where({id: id_customer}))[0];

            console.log(customer.email)
            const mailOptions = {
                from: process.env.MAIL_USER,
                to: customer.email,
                subject: `
                Seu pedido foi realizado com sucesso ${customer.name}!
                `,
                text: `Olá ${customer.name}! Status do pedido: ${status}.
                No valor de: ${await totalPrice(products)}
                `,
            };

            await transporter.sendMail(mailOptions, (err, info) => {
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
                const { quantity, id_product } = product;

                product.id_order = id_order;
                product.id = id_product;

                await db("product_order").where("id", id).update({ id_order, quantity, id_product });

                await updateStock(product);
            }
            return { id, id_customer, installments, status, create_at, products: products };
        },

        deleteOrder: async (_, id) => {
            return db("orders").where(id).delete();
        }
    }
}