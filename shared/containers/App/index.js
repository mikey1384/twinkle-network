import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Header from '../Header';
import Chat from '../Chat';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import io from 'socket.io-client';
import { URL } from 'constants/URL';
import { connect } from 'react-redux';
import { initChatAsync } from 'redux/actions/ChatActions';

const socket = io.connect(URL);
@connect(
  state => ({
    loggedIn: state.UserReducer.loggedIn
  }),
  { initChat: initChatAsync }
)
export default class App extends React.Component {
  state={
    chatMode: false
  }

  componentDidUpdate() {
    ReactDOM.findDOMNode(this).scrollIntoView();
  }

  render() {
    return (
      <div id="main-view">
        <Header
          chatMode={this.state.chatMode}
          onChatButtonClick={ this.onChatButtonClick.bind(this) }
        />
        <div
          style={{display: this.state.chatMode && this.props.loggedIn && 'none'}}
        >
          {this.props.children}
        </div>
        { this.state.chatMode && this.props.loggedIn ?
          <Chat
            socket={socket}
            onUnmount={() => this.setState({chatMode: false})}
          /> :
          <footer
            className="footer col-md-12"
            style={{
              marginTop: '1em'
            }}
          >
            <p className="text-muted text-center">Twinkle © 2016</p>
          </footer>
        }
      </div>
    );
  }

  onChatButtonClick() {
    this.props.initChat(() => {
      this.setState({chatMode: !this.state.chatMode})
    })
  }
}
