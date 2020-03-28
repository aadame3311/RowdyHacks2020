import React, { Component } from 'react';
import './ChatBox.css';


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
        return(
            <div className="ChatBox">
                <div className="ChatBox-Container">
                    <h3>ChatBox</h3>
                </div>
            </div>
        );
    }
}

export default ChatBox;