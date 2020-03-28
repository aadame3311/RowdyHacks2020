import React, { Component } from 'react';
import './App.css';

import ChatBox from './components/ChatBox/ChatBox';
import Queue from './components/Queue/Queue';

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

        <Queue>
        </Queue>
      </div>
    );
  }
}

export default App;