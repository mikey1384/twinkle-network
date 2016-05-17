import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import activeComponent from 'react-router-active-component'

import * as UserActions from 'redux_helpers/actions/UserActions';

import SigninModal from '../Signin';

import { bindActionCreators } from 'redux';
import AccountMenu from './AccountMenu';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

class Header extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
    location: React.PropTypes.object
  }

  state = {
    tabClicked: false
  }

  handleClick() {
    this.setState({
      tabClicked: true
    })
  }

  render () {
    const { signinModalShown, loggedIn, username, userType, isAdmin, userId, dispatch } = this.props;
    const { openSigninModal, closeSigninModal } = UserActions;
    const NavLink = activeComponent('li')
    return (
      <Navbar staticTop fluid>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav onClick={this.handleClick.bind(this)}>
            <NavLink
              to="/"
              onlyActiveOnIndex
              linkProps={{className: 'navbar-brand'}}>
              Twinkle
            </NavLink>
            <NavLink to="/profile">
              Profile
            </NavLink>
            <NavLink to="/posts">
              Posts
            </NavLink>
            <NavLink to="/discussion">
              Discussion
            </NavLink>
            <NavLink to="/contents">
              Contents
            </NavLink>
            { isAdmin &&
              <NavLink to="/management">
                Management
              </NavLink>
            }
          </Nav>
          <Nav pullRight>
            {
              loggedIn ?
              <AccountMenu title={ username }
                {...bindActionCreators(UserActions, dispatch)} />
              : <NavItem onClick={ () => dispatch(openSigninModal()) }>Log In | Sign Up</NavItem>
            }
          </Nav>
        </Navbar.Collapse>
        { signinModalShown &&
          <SigninModal show={true} onHide={ () => dispatch(closeSigninModal()) } />
        }
      </Navbar>
    )
  }
}

export default connect(
  state => ({
    loggedIn: state.UserReducer.loggedIn,
    username: state.UserReducer.username,
    userType: state.UserReducer.userType,
    isAdmin: state.UserReducer.isAdmin,
    userId: state.UserReducer.userId,
    signinModalShown: state.UserReducer.signinModalShown
  })
)(Header);
