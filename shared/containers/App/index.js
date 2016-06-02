import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Header from '../Header';
import Chat from '../Chat';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';


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
          onChatButtonClick={ this.onChatButtonClick.bind(this) }
        />
        <div
          style={{display: this.state.chatMode && 'none'}}
        >
          {this.props.children}
        </div>
        { this.state.chatMode ?
          <Chat /> :
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
    this.setState({chatMode: !this.state.chatMode})
  }
}
