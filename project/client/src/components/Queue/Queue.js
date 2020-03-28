import React, { Component } from 'react';
import './Queue.css';

import Guest from '../../models/Guest';


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

function QueueItem(guest) {
    return <li className="Queue-Item">
        <span className="username">{guest.name}</span>
        <span className="userphone">{guest.phone}</span>
        <span style={{color: 'red', textAlign: 'right'}} className="action-remove">X</span>
    </li>
}

class Queue extends Component {
    state = {
        guests: [
            new Guest("Antonio", "+19564388893"),
            new Guest("Bryan", "+19565635387"),
            new Guest("Eddy", "+19564001877")
        ]
    };

    render() {
        // Renders users in the queue list
        const renderQueueItems = () => {
            let queuedGuests = this.state.guests;
            let renderedItems = [];
            queuedGuests.forEach((guest)=>{
                renderedItems.push(
                    QueueItem(guest)
                )
            });

            return renderedItems;
        }
        const updateQueueList = (queueList) => {
            this.setState({guests: queueList})
        }
        const getTopGuest = () => {
            return this.state.guests[0];
        }

        return(
            <div className="Queue">
                <div className="List-Container">
                    <h3>Queue</h3><span>Time left: <span style={{color: 'red'}}>10s</span></span>
                    <ul>
                        {renderQueueItems()}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Queue;