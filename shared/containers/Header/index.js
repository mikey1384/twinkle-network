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
    tabClicked: false,
    chatMode: false
  }

  handleClick() {
    this.setState({
      tabClicked: true
    })
  }

  render () {
    const { signinModalShown, loggedIn, username, userType, isAdmin, userId, dispatch } = this.props;
    const { chatMode, alphaMode } = this.state;
    const { openSigninModal, closeSigninModal } = UserActions;
    return (
      <Navbar staticTop fluid>
        <Navbar.Toggle />
        <Link
          className="navbar-brand"
          style={{cursor: 'pointer'}}
          to="/"
          onClick={this.handleClick.bind(this)}
        >
          Twinkle
        </Link>
        <Navbar.Collapse>
          { this.renderTabs() }
          <Nav pullRight className="flexbox-container">
            <li>
              <a
                className="well unselectable"
                style={{
                  padding: '0.7em',
                  margin: '0px',
                  cursor: 'pointer'
                }}
                onClick={ this.onChatButtonClick.bind(this) }
              >Messages
              </a>
            </li>
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

  onChatButtonClick() {
    this.setState({chatMode: !this.state.chatMode});
    this.props.onChatButtonClick();
  }

  renderTabs() {
    const NavLink = activeComponent('li');
    const { chatMode } = this.state;
    return chatMode ? null : (
      <Nav onClick={this.handleClick.bind(this)}>
        <NavLink
          to="/"
          onlyActiveOnIndex
        >
          Home
        </NavLink>
        <NavLink to="/contents">
          Contents
        </NavLink>
        { /*
          <NavLink to="/profile">
            Profile
          </NavLink>
          <NavLink to="/posts">
            Posts
          </NavLink>
          <NavLink to="/discussion">
            Discussion
          </NavLink>
          { this.props.isAdmin &&
            <NavLink to="/management">
              Management
            </NavLink>
          }
          */
        }
      </Nav>
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
