import React, { Component } from 'react';
import { NavDropdown, MenuItem } from 'react-bootstrap';

export default class AccountMenu extends Component {
  render () {
    return (
      <NavDropdown eventKey={5} title={this.props.title} id="user-menu">
        <MenuItem eventKey={5.1}>Action</MenuItem>
        <MenuItem eventKey={5.2}>Another action</MenuItem>
        <MenuItem eventKey={5.3}>Something else here</MenuItem>
        <MenuItem divider />
        <MenuItem eventKey={5.4} onClick={ () => this.props.logout() }>Log out</MenuItem>
      </NavDropdown>
    )
  }
}
