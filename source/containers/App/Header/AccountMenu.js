import React from 'react';
import {NavDropdown, MenuItem} from 'react-bootstrap';

export default function AccountMenu(props) {
  return (
    <NavDropdown eventKey="account-menu" title={props.title} id="account-menu">
      <MenuItem eventKey="logout" onClick={() => props.logout()}>Log out</MenuItem>
    </NavDropdown>
  )
}
