import nodemailer from 'nodemailer'
import 'dotenv/config'

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        user: process.env.USER_EMAIL
    },
    connectionTimeout: 10000,  // 10s to establish connection
    greetingTimeout: 10000,    // 10s for server greeting
    socketTimeout: 15000       // 15s for socket inactivity
})

transport.verify()
    .then(() => console.log('Email service ready to send email'))
    .catch((err) => console.log(`Error while starting email service: ${err}`))

export const sendEmail = async ({ to, subject, text = '', html}) => {
    try {
        const info = await transport.sendMail({
            from: `Cerebro AI <cerebro.ai@gmail.com>`,
            to,
            subject,
            text,
            html
        })

        console.log(`Mail successfully sent to: ${to}`)
    } catch (err) {
        throw new Error(`Error sending mail: ${err.message}`);
    }
}