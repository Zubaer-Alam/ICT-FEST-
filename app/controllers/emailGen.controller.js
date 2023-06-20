const nodemailer = require("nodemailer");
require("dotenv").config();

sendGreetingEmail = (recipient_address, key, recipient_name, event) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        port: process.env.PORT,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.MAILPASS,
        }
    });



    let message = {
        from: process.env.EMAIL,
        to: recipient_address,
        subject: "Greetings from ICT Fest 2021!",
        text: `Hello ${recipient_name}. Greetings from ICT Fest 2021. You have successfully registered into ${event} and your unique key is ${key}. Thank you.`,
    }

    transporter.sendMail(message, (err, info) => {
        if (err) console.log(err);
        else console.log(info);
    });
}

module.exports = { sendGreetingEmail };