import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

export default class LeftMenu extends Component {
  static propTypes = {
    menuItems: PropTypes.array.isRequired,
    onClickFeedMenu: PropTypes.func.isRequired,
    style: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired
  };
  render() {
    const { menuItems, onClickFeedMenu, style, url } = this.props;
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
          {menuItems.map(item => (
            <nav
              key={item}
              onClick={() => onClickFeedMenu({ type: item, url })}
              style={{ cursor: 'pointer' }}
            >
              {item}
            </nav>
          ))}
        </div>
      </div>
    );
  }
}
