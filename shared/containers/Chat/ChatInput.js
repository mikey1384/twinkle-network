import React, {Component} from 'react';
import Textarea from 'react-textarea-autosize';
import {stringIsEmpty} from 'helpers/StringHelper';

export default class ChatInput extends Component {
  constructor() {
    super()
    this.state = {
      message: ''
    }
    this.onMessageSubmit = this.onMessageSubmit.bind(this);
  }

  render() {
    return (
      <Textarea
        rows={1}
        className="form-control"
        placeholder="Type a message..."
        onKeyDown={this.onMessageSubmit}
        value={this.state.message}
        onChange={event => this.setState({message: event.target.value})}
        autoFocus
      />
    )
  }

  onMessageSubmit(event) {
    const shiftKeyPressed = event.shiftKey;
    const enterKeyPressed = event.keyCode === 13;
    const {message} = this.state;
    if (enterKeyPressed && !shiftKeyPressed) {
      event.preventDefault();
      if (stringIsEmpty(message)) return;
      this.props.onMessageSubmit(message);
      this.setState({message: ''})
    }
  }
}
