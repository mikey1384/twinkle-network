import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import Icon from 'components/Icon'
import { Color } from 'constants/css'
import { css } from 'emotion'

export default class HeaderNav extends Component {
  static propTypes = {
    active: PropTypes.bool,
    alert: PropTypes.bool,
    alertColor: PropTypes.string,
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
      alert,
      className,
      to,
      children,
      imgLabel,
      isHome,
      isUsername,
      onClick = () => {}
    } = this.props
    return (
      <Route
        path={to}
        exact={isHome && !isUsername}
        children={({ match }) => (
          <div className={`${className} header-nav`}>
            {to ? (
              <Link
                className={`${to && match ? 'active ' : ''} ${
                  alert ? this.styles().alert : ''
                }`}
                style={{ display: 'flex' }}
                to={to}
                onClick={onClick}
              >
                <span className="icon">
                  <Icon icon={isHome ? 'home' : imgLabel} />
                </span>
                <span className="nav-label">{children}</span>
              </Link>
            ) : (
              <a
                className={active ? 'active ' : ''}
                style={{ display: 'flex', cursor: 'pointer' }}
                onClick={onClick}
              >
                <div
                  className={`mobile-no-hover ${
                    alert ? this.styles().alert : ''
                  }`}
                >
                  <Icon icon={imgLabel} />
                </div>
                <span
                  className={`nav-label ${alert ? this.styles().alert : ''}`}
                >
                  {children}
                </span>
              </a>
            )}
          </div>
        )}
      />
    )
  }

  styles = () => {
    const { alertColor } = this.props
    return {
      alert: css`
        span {
          color: ${alertColor || Color.gold()}!important;
        }
      `
    }
  }
}
