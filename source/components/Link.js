import React, {PropTypes} from 'react'
import {browserHistory} from 'react-router'

Link.propTypes = {
  style: PropTypes.object,
  to: PropTypes.string,
  onClickAsync: PropTypes.func,
  children: PropTypes.node,
  target: PropTypes.string
}
export default function Link({to, onClickAsync, children, style, target}) {
  return (
    <a
      style={style}
      href={to}
      onClick={onLinkClick}
    >
      {children}
    </a>
  )

  function onLinkClick(event) {
    event.preventDefault()
    if (target) return window.open(to, target)
    if (typeof onClickAsync === 'function') {
      return onClickAsync().then(
        () => browserHistory.push(to)
      )
    }
    browserHistory.push(to)
  }
}
