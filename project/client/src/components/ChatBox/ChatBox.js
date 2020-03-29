import React, { Component } from 'react';
import './ChatBox.css';
import {uid} from 'react-uid';
import socketIO from 'socket.io-client';

function MessageItem(props) {
    return <div key={uid(props)} className={`MessageItem`}>
        <span className="message-sender">{props.sender}</span>
        <div className={`message-content`}>
            <div className={`${props.origin}`}>
                {props.message}
            </div>
        </div>
    </div>
}
function greet(name) {
    const greetingList = [
        `Hooray! ${name} is here`,
        `Welcome ${name} :)`,
        `About time ${name} showed up`,
        `Everyone say hello to my new friend, ${name}`,
        `Welcome aboard ${name}!`,
    ]

    return greetingList[Math.floor(Math.random() * greetingList.length)];
}

class ChatBox extends Component {
    state = {
        questionInput: "",
        messages: [],
        socket: socketIO('localhost:3001'),
    };

    componentDidMount(){
        const socket = socketIO('localhost:3001');

        socket.on('new-participant', (data) => {
            let {messages} = this.state;
            messages.unshift({
                origin: "geekie",
                sender: "geekie",
                message: greet(data.new_participant.username),
            });

            this.setState({messages: messages}, ()=>{
                document.querySelector(".Top").scrollTo(0, document.querySelector(".Top").scrollHeight);
            });
        })
    }
    handleQuestionInputChange = ({target}) => {
        this.setState({questionInput: target.value});
    }
    handleQuestionSubmit = (e) => {
        e.preventDefault();
        let {questionInput, messages} = this.state;
        this.setState({questionInput: ""});
        messages.unshift({
            origin: "self",
            sender: "",
            message: questionInput,
        });

        this.setState({messages: messages}, ()=>{
            document.querySelector(".Top").scrollTo(0, document.querySelector(".Top").scrollHeight);
        });
        // broadcast question
        this.state.socket.emit('question-entered', questionInput);
    }
    render() {
        const renderMessages = () => {
            let {messages} = this.state;
            let renderedResult = [];
            messages.forEach((msg) => {
                renderedResult.unshift(
                    MessageItem({origin: msg.origin, message: msg.message, sender: msg.sender}));
            });
    
            return renderedResult;
        }
        return(
            <div className="ChatBox">
                <div className="ChatBox-Container">


                    <div className="Top">
                        <div className="messages-container">
                            {renderMessages()}
                        </div>
                    </div>
                    <div className="Bottom">
                        <form onSubmit={this.handleQuestionSubmit}>
                            <input 
                                onChange={this.handleQuestionInputChange}
                                value={this.state.questionInput} 
                                type="text" placeholder="Enter text here..." />
                            <div onClick={this.handleQuestionSubmit} className="SendBtn">[SEND]</div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChatBox;