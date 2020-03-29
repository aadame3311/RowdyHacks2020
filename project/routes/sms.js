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

let participants = {}


router.post('/user_reply', (req, res) => {
    var io = req.app.get('socketio');
    const twiml = new MessagingResponse();
    const RAISE_HAND1 = String.fromCodePoint(9995);
    const RAISE_HAND2 = String.fromCodePoint(128400);

    console.log(req.body.From);
    incommingPhoneNumber = req.body.From;
    incommingMsg = req.body.Body;
    

    

    if (!(incommingPhoneNumber in participants)) {
        console.log(`from: ${incommingPhoneNumber}, saying: ${incommingMsg}`);

        if (incommingMsg == `join:${ROOM_CODE}`) {
            twiml.message('Enter User Name: username:<name>');
        }
        else if (incommingMsg.includes('username:')) {
            console.log(incommingMsg.split(':'));
            const name = incommingMsg.split(':')[1];
    
            var newParticipant = { 'username': name, 'phone': incommingPhoneNumber, 'state': 'joined' };
            
            participants[incommingPhoneNumber] = newParticipant;

            console.log(io);
            console.log(io != null);
    
            io.emit('new-participant', participants);
    
        }
        else if (incommingMsg == RAISE_HAND) {
    
        }
        // user is replying answer
        else {
    
        }
    } 
    else {
        console.log('checking state');
        /* Check States */
        let currParticipant = participants[incommingPhoneNumber];
        console.log(currParticipant);
        if (currParticipant.state == "joined") {
            // logic when user is in joined state
            console.log(incommingMsg.toString());
            if (incommingMsg.toString() == "hand") {
                participants[incommingPhoneNumber].state = "queued";
                io.emit('queue-participant', participants[incommingPhoneNumber]);
                io.on('blah', (data) =>{
                    console.log(data);
                });
            }
        }
        if (currParticipant.state == "queued") {
            // logic when user is in queue
        }
        if (currParticipant.state == "awaitingHostResponse") {
            // logic for when after the user answers host question
        } 
    }
    //console.log(guests);

    res.end('success');
    // res.writeHead(200, { 'Content-Type': 'text/xml' });
    // res.end(twiml.toString());
});

module.exports = router;