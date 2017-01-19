import React from 'react';
import {Link} from 'react-router';

export default function HeaderNav({to, children, selected, onClick}) {
  return (
    <li
      className={selected && 'active'}
      onClick={() => {if (onClick) onClick()}}
    >
      <Link to={to}>{children}</Link>
    </li>
  )
}
