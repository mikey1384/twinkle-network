import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Textarea from 'components/Texts/Textarea'
import { stringIsEmpty, addEmoji, finalizeEmoji } from 'helpers/stringHelpers'

export default class ChatInput extends Component {
  static propTypes = {
    currentChannelId: PropTypes.number.isRequired,
    onMessageSubmit: PropTypes.func.isRequired
  }

  constructor() {
    super()
    this.state = {
      message: ''
    }
    this.onMessageSubmit = this.onMessageSubmit.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentChannelId !== this.props.currentChannelId) {
      this.setState({ message: '' })
      this.Textarea._rootDOMNode.focus()
    }
  }

  render() {
    return (
      <Textarea
        innerRef={ref => {
          this.Textarea = ref
        }}
        minRows={1}
        placeholder="Type a message..."
        onKeyDown={this.onMessageSubmit}
        value={this.state.message}
        onChange={event => this.setState({ message: event.target.value })}
        onKeyUp={event => {
          if (event.key === ' ') {
            this.setState({ message: addEmoji(event.target.value) })
          }
        }}
        autoFocus
      />
    )
  }

  onMessageSubmit(event) {
    const shiftKeyPressed = event.shiftKey
    const enterKeyPressed = event.keyCode === 13
    const { message } = this.state

    if (enterKeyPressed && !shiftKeyPressed) {
      event.preventDefault()
      if (stringIsEmpty(message)) return
      this.props.onMessageSubmit(finalizeEmoji(message))
      this.setState({ message: '' })
    }
  }
}
