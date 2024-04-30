const nodeMailer = require('nodemailer');

exports.sendEmail = async (options) => {

    // const transport = nodeMailer.createTransport({
    //     host: process.env.SMPT_HOST,
    //     port: process.env.SMPT_PORT,
    //     auth: {
    //         user: process.env.SMPT_USER,
    //         pass: process.env.SMPT_pass
    //     },
    //     service: process.env.SMPT_SERVICE
    // });

    var transport = nodeMailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "cf65b54c68fbe3",
            pass: "f3e55b8d77d57f"
        }
    });

    const mailOptions = {
        from: "eddc6947d32d57",
        to: options.email,
        subject: options.subject,
        test: options.message,
        html: `${options.message}`
    }

    await transport.sendMail(mailOptions);
}