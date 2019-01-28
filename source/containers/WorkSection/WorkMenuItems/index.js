import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { NavLink } from 'react-router-dom';

export default class WorkMenuItems extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object
  };
  render() {
    const { className, style } = this.props;
    return (
      <div style={style} className={className}>
        <NavLink to="/xp" activeClassName="active">
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
