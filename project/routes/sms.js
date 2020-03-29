var express = require('express');
var router = express.Router();

// Twilio stuff
const accountSid = process.env.TWILIO_API_KEY;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
client.messages
    .create({ body: 'hi', from: '+13088887142', to: '+1 956-438-8893' })
    .then(messages => {
        console.log('Messages sent!');
    })
    .catch(err => console.error(err));
    
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const ROOM_CODE = "ABC";

var smsRoute = function(io) {
    let participants = {};
    
    //var io = req.app.get('socketio');
    io.on("connection", (socket) => {
        console.log('connection detected');
        

        socket.on('question-entered', (question) => {
            console.log(question);
            if (participants!={}) {
                console.log('looping');
                for (let key in participants) {
                    console.log(participants[key].phone);
                    console.log('sending message');
                    client.messages.create({
                        body: question,
                        from: process.env.TWILIO_PHONE_NUMBER,
                        to: participants[key].phone.toString()
                    })
                    .then(message => console.log(message.id));
                }
            }
        });
    });


    /* POST text message */
    router.post('/bulk_send', (req, res, next) => {
        console.log('Sending Bulk Message...');

        console.log("Finished Sending Bulk Messages...")
    });

    router.post('/user_reply', (req, res) => {
        console.log('detected user reply');
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

                //console.log(io);
                console.log(io != null);
        
                io.emit('new-participant', {participants: participants, new_participant: newParticipant});
        
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
            if (currParticipant.state == "joined") {
                // logic when user is in joined state
                console.log(incommingMsg.toString());
                if (incommingMsg.toString() == "hand") {
                    participants[incommingPhoneNumber].state = "queued";
                    console.log(currParticipant);
                    

                    io.emit('queue-participant', participants[incommingPhoneNumber]);
                }
            }
            if (currParticipant.state == "queued") {
                // logic when user is in queue
            }
            if (currParticipant.state == "answer") {
                // logic for when user can answer
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
    return router;
}

module.exports = smsRoute;