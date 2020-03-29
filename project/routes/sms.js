var express = require('express');
var router = express.Router();

// Twilio stuff
const accountSid = process.env.TWILIO_API_KEY;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const ROOM_CODE = "ABC";

var smsRoute = function(io) {
    //var io = req.app.get('socketio');
    io.on("connection", (socket) => {
        socket.on('question-entered', (question) => {
            client.notify.services(process.env.TWILIO_NOTIFY_SID)
            .notifications.create({
                toBinding: JSON.stringify({
                    binding_type: 'sms', address: process.env.TEST_PHONE_EDDY,
                    binding_type: 'sms', address: process.env.TEST_PHONE_TONY,
                    binding_type: 'sms', address: process.env.TEST_PHONE_BRYAN,
                }),
                body: question
            })
            .then(notification => console.log(notification.sid))
            .catch(error => console.log(error));
        });
    });


    /* POST text message */
    router.post('/bulk_send', (req, res, next) => {
        console.log('Sending Bulk Message...');

        client.notify.services(process.env.TWILIO_NOTIFY_SID)
            .notifications.create({
                toBinding: JSON.stringify({
                    binding_type: 'sms', address: process.env.TEST_PHONE_EDDY,
                    binding_type: 'sms', address: process.env.TEST_PHONE_BRYAN,
                    binding_type: 'sms', address: process.env.TEST_PHONE_TONY,
                }),
                body: "Bulk Message: Hello There!"
            })
            .then(notification => console.log(notification.sid))
            .catch(error => console.log(error));

        console.log("Finished Sending Bulk Messages...")
    });

    let participants = {}
    router.post('/user_reply', (req, res) => {
        
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