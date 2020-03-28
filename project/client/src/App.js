import React, { Component } from 'react';
import './App.css';

import './components/ChatBox/ChatBox';

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
        
        <ChatBox></ChatBox>

      </div>
    );
  }
}

export default App;