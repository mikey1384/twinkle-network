import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

export default class LeftMenu extends Component {
  static propTypes = {
    menuItems: PropTypes.array.isRequired,
    onMenuClick: PropTypes.func.isRequired,
    style: PropTypes.object.isRequired
  };
  render() {
    const { menuItems, onMenuClick, style } = this.props;
    return (
      <div
        style={{
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          ...style
        }}
      >
        <div
          className={css`
            position: -webkit-sticky;
            > nav {
              padding: 1rem;
              background: #fff;
              font-size: 2rem;
            }
          `}
          style={{
            paddingLeft: '1rem',
            position: 'sticky',
            top: '1rem'
          }}
        >
          {menuItems.map(({ key, label }) => (
            <nav
              key={key}
              onClick={() => onMenuClick({ item: key })}
              style={{ cursor: 'pointer' }}
            >
              {label}
            </nav>
          ))}
        </div>
      </div>
    );
  }
}
