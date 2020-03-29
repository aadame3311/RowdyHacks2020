import React, { Component } from 'react';
import './QueueList.css';
import socketIO from 'socket.io-client';


import Participant from '../../models/Participant';


function QueueItem(guest) {
    return <li key={guest.phone} className="Queue-Item">
        <span className="username">{guest.username}</span>
        <span style={{color: 'red', textAlign: 'right'}} className="action-remove">X</span>
    </li>
}



class QueueList extends Component {
    state = {
        queuedParticipants: []
    };

    componentDidMount() {
        const socket = socketIO('localhost:3001');

        socket.on('queue-participant', (_participant) => {
            let queuedParticipants = this.state.queuedParticipants;
            queuedParticipants.push(_participant);
            this.setState({queuedParticipants: queuedParticipants});
            //socket.emit('participant-queued', participants);
            console.log('sending emit');
        });
    }

    render() {
        // Renders users in the queue list
        const renderQueueItems = () => {
            let queuedParticipants = this.state.queuedParticipants;
            let renderedItems = [];
            for (var key in queuedParticipants) {
                renderedItems.push(
                    QueueItem(queuedParticipants[key])
                )
            }

            return renderedItems;
        }
        const updateQueueList = (queueList) => {
            this.setState({guests: queueList})
        }
        const getTopParticipant = () => {
            return this.state.guests[0];
        }

        return(
            <div className="QueueList">
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

export default QueueList;