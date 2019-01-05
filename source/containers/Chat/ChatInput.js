import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Textarea from 'components/Texts/Textarea';
import { stringIsEmpty, addEmoji, finalizeEmoji } from 'helpers/stringHelpers';

export default class ChatInput extends Component {
  static propTypes = {
    currentChannelId: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onHeightChange: PropTypes.func.isRequired,
    onMessageSubmit: PropTypes.func.isRequired,
    style: PropTypes.object
  };

  Textarea = {};

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currentChannelId !== this.props.currentChannelId) {
      this.setState({ message: '' });
      this.Textarea.focus();
    }
  }

  render() {
    const { message, onChange, style } = this.props;
    return (
      <Textarea
        innerRef={ref => {
          this.Textarea = ref;
        }}
        minRows={1}
        placeholder="Type a message..."
        onKeyDown={this.onKeyDown}
        value={message}
        onChange={this.onChange}
        onKeyUp={event => {
          if (event.key === ' ') {
            onChange(addEmoji(event.target.value));
          }
        }}
        autoFocus
        style={style}
      />
    );
  }

  onChange = event => {
    const { onChange, onHeightChange } = this.props;
    setTimeout(() => {
      onHeightChange(this.Textarea?.clientHeight);
    }, 0);
    onChange(event.target.value);
  };

  onKeyDown = event => {
    const shiftKeyPressed = event.shiftKey;
    const enterKeyPressed = event.keyCode === 13;
    const { message, onChange } = this.props;
    if (enterKeyPressed && !shiftKeyPressed) {
      event.preventDefault();
      if (stringIsEmpty(message)) return;
      this.props.onMessageSubmit(finalizeEmoji(message));
      onChange('');
    }
  };
}
