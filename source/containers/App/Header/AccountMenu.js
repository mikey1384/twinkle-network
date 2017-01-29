import React, {PropTypes} from 'react'
import {NavDropdown, MenuItem} from 'react-bootstrap'

AccountMenu.propTypes = {
  title: PropTypes.string,
  logout: PropTypes.func
}
export default function AccountMenu({title, logout}) {
  return (
    <NavDropdown eventKey="account-menu" title={title} id="account-menu">
      <MenuItem eventKey="logout" onClick={() => logout()}>Log out</MenuItem>
    </NavDropdown>
  )
}
