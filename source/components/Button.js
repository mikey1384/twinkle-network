import PropTypes from 'prop-types'
import React, {Component} from 'react'

export default class Button extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.array
    ])
  }
  render() {
    const {onClick, children = null, ...props} = this.props
    return (
      <button
        {...props}
        ref={ref => { this.Button = ref }}
        onClick={event => {
          if (this.Button !== null) this.Button.blur()
          if (onClick) onClick(event)
        }}
      >
        {children}
      </button>
    )
  }
}
