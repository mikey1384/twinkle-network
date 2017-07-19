import PropTypes from 'prop-types'
import React from 'react'
import {NavDropdown, MenuItem} from 'react-bootstrap'

AccountMenu.propTypes = {
  logout: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}
export default function AccountMenu({title, logout}) {
  return (
    <NavDropdown eventKey="account-menu" title={title} id="account-menu">
      <MenuItem eventKey="logout" onClick={() => logout()}>Log out</MenuItem>
    </NavDropdown>
  )
}
