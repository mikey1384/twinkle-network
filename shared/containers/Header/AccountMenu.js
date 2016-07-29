import React from 'react';
import {NavDropdown, MenuItem} from 'react-bootstrap';

export default function AccountMenu(props) {
  return (
    <NavDropdown eventKey={5} title={props.title} id="user-menu">
      <MenuItem eventKey={5.1} onClick={() => props.logout()}>Log out</MenuItem>
    </NavDropdown>
  )
}
