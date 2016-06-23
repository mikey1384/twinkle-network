import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import activeComponent from 'react-router-active-component';
import { openSigninModal, closeSigninModal, logout } from 'redux/actions/UserActions';
import SigninModal from '../Signin';
import { bindActionCreators } from 'redux';
import AccountMenu from './AccountMenu';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';


@connect(
  state => ({
    loggedIn: state.UserReducer.loggedIn,
    username: state.UserReducer.username,
    userType: state.UserReducer.userType,
    isAdmin: state.UserReducer.isAdmin,
    userId: state.UserReducer.userId,
    signinModalShown: state.UserReducer.signinModalShown
  }),
  { openSigninModal, closeSigninModal, logout }
)
export default class Header extends Component {
  state = {
    tabClicked: false
  }

  handleClick() {
    this.setState({
      tabClicked: true
    })
    if (this.props.chatMode) {
      this.props.turnChatOff();
    }
  }

  render () {
    const {
      signinModalShown,
      loggedIn,
      username,
      userType,
      isAdmin,
      userId,
      chatMode,
      openSigninModal,
      closeSigninModal
    } = this.props;

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
            { loggedIn &&
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
            }
            {
              loggedIn ?
              <AccountMenu
                title={ username }
                logout={ this.props.logout }
              /> :
              <NavItem onClick={ () => openSigninModal() }>Log In | Sign Up</NavItem>
            }
          </Nav>
        </Navbar.Collapse>
        { signinModalShown &&
          <SigninModal show={true} onHide={ () => closeSigninModal() } />
        }
      </Navbar>
    )
  }

  onChatButtonClick() {
    this.props.onChatButtonClick();
  }

  renderTabs() {
    const NavLink = activeComponent('li');
    const { chatMode } = this.props;
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
