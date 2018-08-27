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
    style: PropTypes.object,
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
      onClick = () => {},
      style
    } = this.props
    return (
      <Route
        path={to}
        exact={isHome && !isUsername}
        children={({ match }) => (
          <div
            className={`${className} header-nav`}
            style={{ display: 'flex', justifyContent: 'center', ...style }}
          >
            {to ? (
              <Link
                className={`${to && match ? 'active ' : ''} ${
                  alert ? this.styles().alert : ''
                }`}
                style={{ display: 'flex', alignItems: 'center' }}
                to={to}
                onClick={onClick}
              >
                <Icon icon={isHome ? 'home' : imgLabel} />
                <span className="nav-label" style={{ marginLeft: '0.7rem' }}>
                  {children}
                </span>
              </Link>
            ) : (
              <a
                className={active ? 'active ' : ''}
                style={{
                  display: 'flex',
                  cursor: 'pointer',
                  justifyContent: 'center'
                }}
                onClick={onClick}
              >
                <div>
                  <Icon
                    icon={imgLabel}
                    className={`mobile-no-hover ${
                      alert ? this.styles().alert : ''
                    }`}
                  />
                </div>
                <span
                  className={`nav-label ${alert ? this.styles().alert : ''}`}
                  style={{ marginLeft: '0.7rem' }}
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
        color: ${alertColor || Color.gold()}!important;
      `
    }
  }
}
