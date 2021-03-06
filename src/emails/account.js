const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendWelcomeEmail(email, name) {
    sgMail.send({
        to: email,
        from: 'b0hcoder@gmail.com',
        subject: 'Thanks for joining us',
        text: `Welcome to the app, ${name}`
    })
}
function sendCancelationEmail(email, name) {
    sgMail.send({
        to: email,
        from: 'b0hcoder@gmail.com',
        subject: 'Sorry to see you go',
        text: `Goodbye, ${name}. I hope to see you soon`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
// const msg = {
//     to: 'test@example.com',
//     from: 'test@example.com',
//     subject: 'Sending with Twilio SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js',
//     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//   };
//   sgMail.send(msg);

