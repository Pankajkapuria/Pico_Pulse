const nodeMailer = require('nodemailer');

exports.sendEmail = async (options) => {
    const transport = nodeMailer.createTransport({
        service: 'gmail',
        secure: true,
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        auth: {
            user: process.env.SMPT_USER,
            pass: process.env.SMPT_pass
        },
        service: process.env.SMPT_SERVICE
    });

    const mailOptions = {
        from: process.env.SMPT_USER,
        to: options.email,
        subject: options.subject,
        test: options.message,
        html: `${options.message}`
    }
    await transport.sendMail(mailOptions)
}
