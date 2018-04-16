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
import { scrollElementToCenter } from 'helpers/domHelpers'
import { css } from 'emotion'

export default class InputForm extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    clickListenerState: PropTypes.bool,
    formGroupStyle: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    rows: PropTypes.number,
    style: PropTypes.object,
    className: PropTypes.string
  }

  state = {
    text: ''
  }

  componentDidUpdate(prevProps) {
    if (prevProps.clickListenerState !== this.props.clickListenerState) {
      let nodes = this.InputArea.childNodes
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].tagName === 'TEXTAREA') {
          nodes[i].focus()
          scrollElementToCenter(nodes[i])
        }
      }
    }
  }

  render() {
    const { text } = this.state
    const {
      placeholder,
      rows,
      autoFocus,
      formGroupStyle = {},
      style = {},
      className = ''
    } = this.props
    const commentExceedsCharLimit = exceedsCharLimit({
      contentType: 'comment',
      text
    })
    return (
      <div style={style} className={className}>
        <div
          style={{
            position: 'relative',
            ...formGroupStyle
          }}
          ref={ref => {
            this.InputArea = ref
          }}
        >
          <Textarea
            autoFocus={autoFocus}
            style={{
              fontSize: '1.7rem',
              ...(commentExceedsCharLimit || {})
            }}
            minRows={rows}
            value={text}
            placeholder={placeholder}
            onChange={event => this.setState({ text: event.target.value })}
            onKeyUp={this.handleKeyUp}
          />
          {commentExceedsCharLimit && (
            <small style={{ color: 'red', fontSize: '1.3rem' }}>
              {renderCharLimit({
                contentType: 'comment',
                text
              })}
            </small>
          )}
        </div>
        <div
          className={css`
            display: flex;
            flex-direction: row-reverse;
          `}
        >
          <Button
            style={{ marginTop: '1rem' }}
            filled
            success
            disabled={stringIsEmpty(text) || commentExceedsCharLimit}
            onClick={this.onSubmit}
          >
            Click This Button to Submit!
          </Button>
        </div>
      </div>
    )
  }

  handleKeyUp = event => {
    if (event.key === ' ') this.setState({ text: addEmoji(event.target.value) })
  }

  onSubmit = () => {
    if (!stringIsEmpty(this.state.text)) {
      this.props.onSubmit(finalizeEmoji(this.state.text))
      this.setState({ text: '' })
    }
  }
}
