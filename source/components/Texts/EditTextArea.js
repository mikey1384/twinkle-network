import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Button from 'components/Button'
import Textarea from 'components/Texts/Textarea'
import {
  exceedsCharLimit,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji,
  renderCharLimit
} from 'helpers/stringHelpers'

export default class EditTextArea extends Component {
  static propTypes = {
    allowEmptyText: PropTypes.bool,
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
  }

  render() {
    const { editedText } = this.state
    const {
      allowEmptyText,
      autoFocus = false,
      placeholder = 'Enter text',
      rows = 4,
      marginTop = '1rem'
    } = this.props
    const commentExceedsCharLimit = exceedsCharLimit({
      contentType: 'comment',
      text: editedText
    })
    return (
      <div style={{ lineHeight: 1 }}>
        <Textarea
          placeholder={placeholder}
          autoFocus={autoFocus}
          style={{
            marginTop,
            position: 'relative',
            ...(commentExceedsCharLimit || {})
          }}
          minRows={rows}
          value={editedText}
          onChange={this.onChange}
          onKeyUp={this.handleKeyUp}
        />
        {commentExceedsCharLimit && (
          <small style={{ color: 'red', fontSize: '1.3rem', lineHeight: 1 }}>
            {renderCharLimit({
              contentType: 'comment',
              text: editedText
            })}
          </small>
        )}
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
            disabled={
              (!allowEmptyText && stringIsEmpty(editedText)) ||
              commentExceedsCharLimit
            }
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

  onChange = event => {
    this.setState({ editedText: event.target.value })
  }

  handleKeyUp = event => {
    if (event.key === ' ') {
      this.setState({ editedText: addEmoji(event.target.value) })
    }
  }

  onSubmit = () => {
    const { onEditDone } = this.props
    const { editedText } = this.state
    return onEditDone(finalizeEmoji(editedText))
  }
}
