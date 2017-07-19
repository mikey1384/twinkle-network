import PropTypes from 'prop-types'
import React, {Component} from 'react'
import Button from 'components/Button'
import Textarea from 'react-textarea-autosize'
import {stringIsEmpty, addEmoji, finalizeEmoji} from 'helpers/stringHelpers'

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
    const {editedText} = this.state
    const {autoFocus = false, placeholder = 'Enter text', rows = 4, marginTop = '1em'} = this.props
    return (
      <div>
        <Textarea
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="form-control"
          style={{marginTop}}
          minRows={rows}
          value={editedText}
          onChange={this.onChange}
          onKeyUp={this.handleKeyUp}
        />
        <div
          style={{
            marginTop: '1em'
          }}
        >
          <Button
            className="btn btn-default btn-sm"
            onClick={this.onSubmit}
            disabled={stringIsEmpty(editedText)}
          >
            Done
          </Button>
          <Button
            className="btn btn-default btn-sm"
            style={{
              marginLeft: '0.5em'
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
    this.setState({editedText: event.target.value})
  }

  handleKeyUp(event) {
    if (event.key === ' ') this.setState({editedText: addEmoji(event.target.value)})
  }

  onSubmit() {
    const {onEditDone} = this.props
    const {editedText} = this.state
    onEditDone(finalizeEmoji(editedText))
  }
}
