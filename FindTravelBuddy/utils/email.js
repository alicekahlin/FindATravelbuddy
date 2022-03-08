const nodemailer = require('nodemailer');

const sendEmail = async options => {
    //1) Create a transporter
    var transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "6e9aa9eb1d685a",
            pass: "95b2f8054bf78f"
        }
    });

    //2) Define the email options
    const mailOptions = {
        from: "TravelBuddy <travelbuddy@noreplay.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    //3) Actuallt sent the email with nodemailer
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;