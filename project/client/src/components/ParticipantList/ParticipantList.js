import React, { Component } from 'react';
import './ParticipantList.css';
import Participant from '../../models/Participant';
import socketIO from 'socket.io-client';


function ParticipantItem(participant) {
    return <li key={participant.phone} className="Queue-Item">
        <span className="username">{participant.username}</span>
        <span className="userphone">{participant.phone}</span>
        <span style={{color: 'red', textAlign: 'right'}} className="action-remove">X</span>
    </li>
}


class ParticipantList extends Component {
    state = {
        participants: {}
    };

    
    componentDidMount(){
        const socket = socketIO('localhost:3001');
        socket.on('new-participant', (data) => {
            this.setState({participants: data});
        })
    }
    
    render() {
        const addParticipant = (participant) => {
            
        }

        const renderParticipantItems = () => {
            let participants = this.state.participants;
            let renderedItems = [];
            console.log('rendering participants');
            console.log(participants);
            for (var key in participants) {
                renderedItems.push(
                    ParticipantItem(participants[key])
                )
            }

            return renderedItems;
        }
        return(
            <div className="ParticipantList">
                <div className="List-Container">
                    <h3>Participants</h3>
                    <ul>
                        {renderParticipantItems()}
                    </ul>
                </div>
            </div>
        );
    }
}

export default ParticipantList;