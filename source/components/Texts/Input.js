import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class Input extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired
  }
  render() {
    const {onChange, ...props} = this.props
    return (
      <input
        {...props}
        ref={ref => { this._rootDOMNode = ref }}
        onChange={event => onChange(renderText(event.target.value))}
      />
    )
  }
}

function renderText(text) {
  let newText = text
  while (
    newText !== '' &&
    (newText[0] === ' ' ||
    (newText[newText.length - 1] === ' ') && (newText[newText.length - 2] === ' '))
  ) {
    if (newText[0] === ' ') {
      newText = newText.substring(1)
    }
    if ((newText[newText.length - 1] === ' ') && (newText[newText.length - 2] === ' ')) {
      newText = newText.slice(0, -1)
    }
  }
  return newText
}
