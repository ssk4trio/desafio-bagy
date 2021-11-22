require('dotenv').config()
const nodemailer = require("nodemailer");
nodemailer.create
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

module.exports = transporter;