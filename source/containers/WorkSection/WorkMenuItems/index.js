import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { NavLink } from 'react-router-dom';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';

export default class WorkMenuItems extends Component {
  static propTypes = {
    style: PropTypes.object
  };
  render() {
    const { style } = this.props;
    return (
      <div
        style={style}
        className={css`
          display: flex;
          font-size: 2rem;
          font-family: sans-serif, verdana;
          padding-left: 0;
          flex-direction: column;
          > a {
            padding: 1.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            margin-left: -2rem;
            text-align: center;
            width: 100%;
            justify-content: center;
            color: ${Color.gray()};
            text-decoration: none;
          }
          > a:hover {
            font-weight: bold;
            color: ${Color.black()};
          }
          > a.active {
            font-weight: bold;
            color: ${Color.black()};
            background: #fff;
          }
          @media (max-width: ${mobileMaxWidth}) {
            display: none;
          }
        `}
      >
        <NavLink to="/work" activeClassName="active">
          <Icon icon="bolt" />
          <span style={{ marginLeft: '1.1rem' }}>XP</span>
        </NavLink>
        <NavLink to="/videos" activeClassName="active">
          <Icon icon="film" />
          <span style={{ marginLeft: '1.1rem' }}>Watch</span>
        </NavLink>
        <NavLink to="/links" activeClassName="active">
          <Icon icon="book" />
          <span style={{ marginLeft: '1.1rem' }}>Read</span>
        </NavLink>
      </div>
    );
  }
}
