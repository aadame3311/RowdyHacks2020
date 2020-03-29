import React, { Component } from 'react';
import './ChatBox.css';

import socketIO from 'socket.io-client';

// const sendSMS = () => {
//   let data = {
//     "message_body": "this is a message body"
//   }
//   fetch('/sms', {
//     method: 'post',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify(data),
//   }
// )}

class ChatBox extends Component {
    state = {};
    render() {
        
        const sendSMS = () => {
            console.log('sending sms');
        }
        return(
            <div className="ChatBox">
                <div className="ChatBox-Container">


                    <div className="Top">
                        <h3>ChatBox</h3>
                    </div>
                    <div className="Bottom">
                        <input type="text" placeholder="Enter text here..." />
                        <div onClick={sendSMS} className="SendBtn">[SEND]</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChatBox;