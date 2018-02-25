import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import Icon from 'components/Icon'

export default class HeaderNav extends Component {
  static propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
    imgLabel: PropTypes.string,
    isHome: PropTypes.bool,
    isUsername: PropTypes.bool,
    onClick: PropTypes.func,
    to: PropTypes.string
  }

  render() {
    const {
      active,
      className,
      to,
      children,
      imgLabel,
      isHome,
      isUsername,
      onClick
    } = this.props
    return (
      <Route
        path={to}
        exact={isHome && !isUsername}
        children={({ match }) => (
          <div className={`${className} header-nav`}>
            {to ? (
              <Link
                className={to && match && 'active'}
                style={{ display: 'flex' }}
                to={to}
              >
                <span className="icon">
                  <Icon icon={isHome ? 'home' : imgLabel} />
                </span>
                <span className="nav-label">{children}</span>
              </Link>
            ) : (
              <a
                className={active && 'active'}
                style={{ display: 'flex', cursor: 'pointer' }}
                onClick={onClick}
              >
                <span
                  className={`glyphicon glyphicon-${imgLabel} mobile-no-hover`}
                />
                <span className="nav-label">{children}</span>
              </a>
            )}
          </div>
        )}
      />
    )
  }
}
