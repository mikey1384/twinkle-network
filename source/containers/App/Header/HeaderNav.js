import React, {PropTypes} from 'react'
import {Link} from 'react-router'

HeaderNav.propTypes = {
  to: PropTypes.string,
  children: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func
}
export default function HeaderNav({to, children, selected, onClick}) {
  return (
    <li
      className={selected && 'active'}
      onClick={() => { if (onClick) onClick() }}
    >
      <Link to={to}>{children}</Link>
    </li>
  )
}
