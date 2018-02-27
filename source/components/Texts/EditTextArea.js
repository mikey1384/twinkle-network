import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Button from 'components/Button'
import Textarea from 'components/Texts/Textarea'
import { stringIsEmpty, addEmoji, finalizeEmoji } from 'helpers/stringHelpers'

export default class EditTextArea extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    marginTop: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    rows: PropTypes.number,
    text: PropTypes.string.isRequired
  }

  constructor(props) {
    super()
    this.state = {
      editedText: props.text
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  render() {
    const { editedText } = this.state
    const {
      autoFocus = false,
      placeholder = 'Enter text',
      rows = 4,
      marginTop = '1rem'
    } = this.props
    return (
      <div>
        <Textarea
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="form-control"
          style={{ marginTop, position: 'relative' }}
          minRows={rows}
          value={editedText}
          onChange={this.onChange}
          onKeyUp={this.handleKeyUp}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row-reverse',
            marginTop: '1rem'
          }}
        >
          <Button
            primary
            onClick={this.onSubmit}
            disabled={stringIsEmpty(editedText)}
          >
            Done
          </Button>
          <Button
            transparent
            style={{
              marginRight: '1rem'
            }}
            onClick={() => this.props.onCancel()}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  onChange(event) {
    this.setState({ editedText: event.target.value })
  }

  handleKeyUp(event) {
    if (event.key === ' ') {
      this.setState({ editedText: addEmoji(event.target.value) })
    }
  }

  onSubmit() {
    const { onEditDone } = this.props
    const { editedText } = this.state
    return onEditDone(finalizeEmoji(editedText))
  }
}
