import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Header from '../Header';
import Chat from '../Chat';
import {LinkContainer} from 'react-router-bootstrap';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import io from 'socket.io-client';
import {connect} from 'react-redux';
import {initChatAsync, resetChat} from 'redux/actions/ChatActions';
import {URL} from 'constants/URL';


const socket = io.connect(URL);
@connect(
  state => ({
    loggedIn: state.UserReducer.loggedIn
  }),
  {
    initChat: initChatAsync,
    resetChat
  }
)
export default class App extends Component {
  constructor() {
    super()
    this.state={chatMode: false}
    this.onChatButtonClick = this.onChatButtonClick.bind(this)
  }

  componentDidUpdate(prevProps) {
    ReactDOM.findDOMNode(this).scrollIntoView();
    if (this.props.children !== prevProps.children) this.setState({chatMode: false})
  }

  render() {
    const display = this.state.chatMode && this.props.loggedIn ? 'none' : 'block';
    return (
      <div id="main-view">
        <Header
          socket={socket}
          chatMode={this.state.chatMode}
          onChatButtonClick={this.onChatButtonClick}
          turnChatOff={() => this.setState({chatMode: false})}
        />
        <div
          style={{display}}
        >
          {this.props.children}
        </div>
        {this.state.chatMode && this.props.loggedIn ?
          <Chat
            socket={socket}
            onUnmount={() => {
              this.props.resetChat();
              this.setState({chatMode: false})}
            }
          /> :
          <footer
            className="footer col-md-12"
            style={{marginTop: '1em'}}
          >
            <p className="text-muted text-center">Twinkle © 2016</p>
          </footer>
        }
      </div>
    )
  }

  onChatButtonClick() {
    this.props.initChat(() => {
      this.setState({chatMode: !this.state.chatMode});
    })
  }
}
