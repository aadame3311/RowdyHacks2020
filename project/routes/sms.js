var express = require('express');
var router = express.Router();

// Twilio stuff
const accountSid = process.env.TWILIO_API_KEY;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

/* POST text message */
router.post('/', (req, res, next) => {
    console.log('sending sms');
    client.messages
        .create({body: 'Hello :)', from: process.env.TWILIO_PHONE_NUMBER, to: process.env.TEST_PHONE_TONY})
        .then(message => console.log(message.sid));
});

module.exports = router;