import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'

export default class HeaderNav extends Component {
  static propTypes = {
    children: PropTypes.node,
    imgLabel: PropTypes.string.isRequired,
    isHome: PropTypes.bool,
    isUsername: PropTypes.bool,
    style: PropTypes.object,
    to: PropTypes.string.isRequired
  }

  constructor() {
    super()
    this.state = {
      hovered: false
    }
  }

  render() {
    const {
      imgLabel,
      style = {},
      to,
      children,
      isHome,
      isUsername
    } = this.props
    const { hovered } = this.state
    return (
      <Route
        path={to}
        exact={isHome && !isUsername}
        children={({ match }) => (
          <li
            className={`header-nav ${match ? 'active' : ''}`}
            onMouseEnter={() => this.setState({ hovered: true })}
            onMouseLeave={() => this.setState({ hovered: false })}
          >
            <Link style={style} to={to}>
              <div className="flexbox-container">
                <span
                  className={`nav-icon-${imgLabel}${
                    match || hovered ? '-hovered' : ''
                  }`}
                />
                {children}
                <div className="clear-fix" />
              </div>
            </Link>
          </li>
        )}
      />
    )
  }
}
