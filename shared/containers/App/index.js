import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Header from '../Header';
import Chat from '../Chat';
import {LinkContainer} from 'react-router-bootstrap';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import io from 'socket.io-client';
import {connect} from 'react-redux';
import {initChatAsync, resetChat, toggleChat, turnChatOn, turnChatOff} from 'redux/actions/ChatActions';
import {URL} from 'constants/URL';


const socket = io.connect(URL);
@connect(
  state => ({
    loggedIn: state.UserReducer.loggedIn,
    chatMode: state.ChatReducer.chatMode
  }),
  {
    toggleChat,
    turnChatOff,
    initChat: initChatAsync,
    resetChat
  }
)
export default class App extends Component {
  constructor() {
    super()
    this.onChatButtonClick = this.onChatButtonClick.bind(this)
  }

  componentDidUpdate(prevProps) {
    const {turnChatOff} = this.props;
    ReactDOM.findDOMNode(this).scrollIntoView();
    if (this.props.children !== prevProps.children) turnChatOff();
  }

  render() {
    const {chatMode, turnChatOff} = this.props;
    const style = chatMode && this.props.loggedIn ? {
      display: 'none'
    } : null

    return (
      <div id="main-view">
        <Header
          socket={socket}
          chatMode={chatMode}
          onChatButtonClick={this.onChatButtonClick}
          turnChatOff={() => turnChatOff()}
        />
        <div
          style={style}
        >
          {this.props.children}
        </div>
        {chatMode && this.props.loggedIn ?
          <Chat
            socket={socket}
            onUnmount={
              () => {
                this.props.resetChat();
                turnChatOff();
              }
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
    const {toggleChat} = this.props;
    this.props.initChat(() => {
      toggleChat();
    })
  }
}
