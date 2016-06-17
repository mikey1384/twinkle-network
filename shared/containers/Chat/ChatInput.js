import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';

export default class ChatInput extends Component {
  constructor(props) {
    super()
    this.state = {
      message: ''
    }
  }

  render() {
    return (
      <Textarea
        rows={1}
        className="form-control"
        placeholder="Type a message..."
        onKeyDown={this.onMessageSubmit.bind(this)}
        value={this.state.message}
        onChange={ event => this.setState({message: event.target.value}) }
        autoFocus
      />
    )
  }

  onMessageSubmit(event) {
    const shiftKeyPressed = event.shiftKey;
    const enterKeyPressed = event.keyCode === 13;
    if (enterKeyPressed && !shiftKeyPressed) {
      event.preventDefault();
      this.props.onMessageSubmit(this.state.message);
      this.setState({message: ''})
    }
  }
}
