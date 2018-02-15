import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import { HeaderNavStyle } from './Styles'

export default class HeaderNav extends Component {
  static propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
    imgLabel: PropTypes.string,
    isHome: PropTypes.bool,
    isUsername: PropTypes.bool,
    to: PropTypes.string
  }

  render() {
    const {
      className,
      to,
      children,
      imgLabel,
      isHome,
      isUsername,
      active
    } = this.props
    return (
      <Route
        path={to}
        exact={isHome && !isUsername}
        children={({ match }) => (
          <div className={`${className} ${HeaderNavStyle}`}>
            {to ? (
              <Link
                className={to && match && 'active'}
                style={{ display: 'flex' }}
                to={to}
              >
                <span
                  className={`glyphicon glyphicon-${
                    isHome ? 'home' : imgLabel
                  }`}
                />
                <span className="nav-label">{children}</span>
              </Link>
            ) : (
              <a
                className={active && 'active'}
                style={{ display: 'flex', cursor: 'pointer' }}
              >
                <span className={`glyphicon glyphicon-${imgLabel}`} />
                <span className="nav-label">{children}</span>
              </a>
            )}
          </div>
        )}
      />
    )
  }
}
