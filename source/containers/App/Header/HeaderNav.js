import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import Icon from 'components/Icon';
import { Color } from 'constants/css';

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
  };

  render() {
    const {
      active,
      alert,
      alertColor,
      className,
      to,
      children,
      imgLabel,
      isHome,
      isUsername,
      onClick = () => {},
      style
    } = this.props;
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
                className={to && match ? 'active ' : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  ...(alert ? { color: alertColor || Color.gold() } : {})
                }}
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
                    style={{
                      ...(alert ? { color: alertColor || Color.gold() } : {})
                    }}
                    icon={imgLabel}
                  />
                </div>
                <span
                  className="nav-label"
                  style={{
                    marginLeft: '0.7rem',
                    ...(alert ? { color: alertColor || Color.gold() } : {})
                  }}
                >
                  {children}
                </span>
              </a>
            )}
          </div>
        )}
      />
    );
  }
}
