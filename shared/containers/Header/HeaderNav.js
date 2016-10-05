import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

export default class HeaderNav extends Component {
  render() {
    const {to, children, selected, onClick} = this.props;
    return (
      <li
        className={selected && 'active'}
        onClick={() => {if (onClick) onClick()}}
      >
        <Link to={to}>{children}</Link>
      </li>
    )
  }
}
