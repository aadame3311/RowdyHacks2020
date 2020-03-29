import React, { Component } from 'react';
import './App.css';

import ChatBox from './components/ChatBox/ChatBox';
import QueueList from './components/Queue/Queue';

class App extends Component {
  state = {users: []}

  componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(users => this.setState({ users }));
  }

  render() {
    return (
      <div className="App">
        <ChatBox>
        </ChatBox>

        <QueueList>
        </QueueList>
      </div>
    );
  }
}

export default App;