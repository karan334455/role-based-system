const nodemailer = require("nodemailer");
const otpTemplate = require("../templates/otpTemplate");

const transporter =
    nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

const sendOtpMail = async (
    email,
    otp
) => {
    try {
        const info =
            await transporter.sendMail({
                from: `"Role SaaS System" <${process.env.EMAIL_USER}>`,
                to: email,
                subject:
                    "Email Verification OTP",
                html: otpTemplate(otp),
            });

        console.log(
            "OTP Email sent:",
            info.messageId
        );

        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const sendCustomMail =
    async (
        email,
        subject,
        html
    ) => {
        try {
            const info =
                await transporter.sendMail({
                    from: `"Role SaaS System" <${process.env.EMAIL_USER}>`,
                    to: email,
                    subject,
                    html,
                });

            console.log(
                "Email sent:",
                info.messageId
            );

            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

module.exports = {
    sendOtpMail,
    sendCustomMail,
};