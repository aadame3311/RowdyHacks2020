var express = require('express');
var router = express.Router();

// socket 
//var http = require('http').createServer(app);
//var io = require('socket.io')(http);

// Twilio stuff
const accountSid = process.env.TWILIO_API_KEY;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

var users = [];
const ROOM_CODE = "ABC";



const emitSMS = (socket, name) => {
    console.log("emitting");
    socket.broadcast.emit('hi', name);
}

/* POST text message */
router.post('/', (req, res, next) => {
    console.log('sending sms');
    client.messages
        .create({ body: 'Hello :)', from: process.env.TWILIO_PHONE_NUMBER, to: process.env.TEST_PHONE_TONY })
        .then(message => console.log(message.sid));
});

let guests = {}

router.post('/user_reply', (req, res) => {
    const twiml = new MessagingResponse();

    console.log(req.body.From);
    incommingPhoneNumber = req.body.From;
    incommingMsg = req.body.Body;

    if (!(incommingPhoneNumber in guests)) {
        console.log(`from: ${incommingPhoneNumber}, saying: ${incommingMsg}`);

        if (incommingMsg == `join:${ROOM_CODE}`) {
            twiml.message('Enter User Name: username:<name>');
        }
        else if (incommingMsg.includes('username:')) {
            console.log(incommingMsg.split(':'));
            const name = incommingMsg.split(':')[1];
    
            var newUser = { 'username': name, 'phone': incommingPhoneNumber, 'state': 'joined' };
            
            guests[incommingPhoneNumber] = newUser;

            var io = req.app.get('socketio');
            console.log(io);
            console.log(io != null);
    
            io.emit('new-guest', guests);
    
        }
        else if (incommingMsg == RAISE_HAND) {
    
        }
        // user is replying answer
        else {
    
        }
    }
    console.log(guests);

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

module.exports = router;