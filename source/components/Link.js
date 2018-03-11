import PropTypes from 'prop-types'
import React from 'react'
import { withRouter } from 'react-router'

Link.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  history: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  onClickAsync: PropTypes.func,
  style: PropTypes.object,
  target: PropTypes.string,
  to: PropTypes.string
}
function Link({ className, to, onClick, onClickAsync, children, style, target, history }) {
  return (
    <a className={className} style={style} href={to} onClick={onLinkClick}>
      {children}
    </a>
  )

  function onLinkClick(event) {
    event.preventDefault()
    if (target) return window.open(to, target)
    if (typeof onClickAsync === 'function') {
      return onClickAsync().then(clickSafe => {
        if (!clickSafe) history.push(to)
      })
    }
    history.push(to)
    if (onClick) onClick()
  }
}

export default withRouter(Link)
