import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {users: []}

  componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(users => this.setState({ users }));
    
    
  }

  render() {
    const sendSMS = () => {
      let data = {
        "message_body": "this is a message body"
      }
      fetch('/sms', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      }
    )}

    return (
      <div className="App">
        <h1>Users</h1>
        {this.state.users.map(user =>
          <div key={user.id}>{user.username}</div>
        )}

        <button onClick={sendSMS}>Send SMS</button>
      </div>
    );
  }
}

export default App;