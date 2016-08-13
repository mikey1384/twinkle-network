import React, {Component, PropTypes} from 'react';
import Textarea from 'react-textarea-autosize';
import {stringIsEmpty} from 'helpers/stringHelpers';

export default class ChatInput extends Component {
  static propTypes = {
    onMessageSubmit: PropTypes.func.isRequired,
    currentChannelId: PropTypes.number.isRequired
  }

  constructor() {
    super()
    this.state = {
      message: ''
    }
    this.onMessageSubmit = this.onMessageSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentChannelId !== this.props.currentChannelId) {
      this.setState({message: ''})
    }
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
