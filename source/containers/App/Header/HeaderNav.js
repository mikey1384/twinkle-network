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
    pathname: PropTypes.string,
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
      pathname,
      onClick = () => {},
      style
    } = this.props;
    const highlighted =
      to === '/xp' &&
      ['videos', 'links'].indexOf(pathname?.split('/')[1]) !== -1;
    return (
      <Route
        path={to}
        exact={isHome && !isUsername}
        children={({ match }) => (
          <div className={`${className} header-nav`} style={style}>
            {to ? (
              <Link
                className={to && (match || highlighted) ? 'active ' : ''}
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
                <Icon
                  style={{
                    ...(alert ? { color: alertColor || Color.gold() } : {})
                  }}
                  icon={imgLabel}
                />
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
