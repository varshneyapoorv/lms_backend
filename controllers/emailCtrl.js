const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (data, req, res) => {

    console.log("I m here")
    // Create a Nodemailer transporter using Mailtrap SMTP settings
    let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io", // Mailtrap SMTP host
        port: 587,                // Mailtrap SMTP port
        secure: false,            // Use TLS
        auth: {
            user: process.env.MAILTRAP_USER, // Mailtrap username
            pass: process.env.MAILTRAP_PASS, // Mailtrap password
        }
    });

    // Send email
    let info = await transporter.sendMail({
        from: "Developer's Corner <your-email@example.com>", // Replace with your email
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html,
    });

    console.log("Message sent:", info.messageId);
    console.log("Preview URL: ", nodemailer.getTestMessageUrl(info));

    // Respond back to the client if necessary
    return  "Email sent successfully."
});

module.exports = sendEmail;
