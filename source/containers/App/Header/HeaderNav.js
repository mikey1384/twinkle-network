import PropTypes from 'prop-types'
import React from 'react'
import {Link, Route} from 'react-router-dom'

HeaderNav.propTypes = {
  to: PropTypes.string,
  children: PropTypes.string,
  isUsername: PropTypes.bool,
  isHome: PropTypes.bool,
  onClick: PropTypes.func
}
export default function HeaderNav({to, children, isHome, isUsername, onClick}) {
  return (
    <Route path={to} exact={isHome && !isUsername} children={({match}) => (
      <li
        className={match && 'active'}
        onClick={() => { if (onClick) onClick() }}
      >
        <Link to={to}>{children}</Link>
      </li>
    )}/>
  )
}
