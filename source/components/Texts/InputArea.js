import React, {Component, PropTypes} from 'react'
import Button from 'components/Button'
import Textarea from 'react-textarea-autosize'
import {stringIsEmpty, addEmoji} from 'helpers/stringHelpers'
import {scrollElementToCenter} from 'helpers/domHelpers'

export default class InputArea extends Component {
  static propTypes = {
    clickListenerState: PropTypes.bool,
    placeholder: PropTypes.string,
    rows: PropTypes.number,
    autoFocus: PropTypes.bool,
    formGroupStyle: PropTypes.object,
    onSubmit: PropTypes.func
  }
  constructor() {
    super()
    this.state = {
      text: ''
    }
    this.onSubmit = this.onSubmit.bind(this)
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
    const {text} = this.state
    const {placeholder, rows, autoFocus, formGroupStyle} = this.props
    return (
      <div className="container-fluid">
        <div
          className="row form-group"
          style={formGroupStyle && formGroupStyle}
          ref={ref => { this.InputArea = ref }}
        >
          <Textarea
            autoFocus={autoFocus}
            className="form-control"
            rows={rows}
            value={text}
            placeholder={placeholder}
            onChange={event => this.setState({text: addEmoji(event.target.value)})}
          />
        </div>
        <div className="row">
          <Button
            className="btn btn-default btn-sm"
            disabled={stringIsEmpty(text)}
            onClick={this.onSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    )
  }

  onSubmit() {
    if (!stringIsEmpty(this.state.text)) {
      this.props.onSubmit(this.state.text)
      this.setState({text: ''})
    }
  }
}
