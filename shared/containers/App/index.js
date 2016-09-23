import React, {Component, PropTypes} from 'react';
import Header from '../Header';
import Chat from '../Chat';
import io from 'socket.io-client';
import {connect} from 'react-redux';
import {initChatAsync, resetChat, toggleChat, turnChatOff} from 'redux/actions/ChatActions';
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
  static propTypes = {
    children: PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.onChatButtonClick = this.onChatButtonClick.bind(this)
  }

  componentDidUpdate(prevProps) {
    const {turnChatOff} = this.props;
    if (this.props.children !== prevProps.children) turnChatOff()
  }

  render() {
    const {chatMode, turnChatOff, location} = this.props;
    const style = chatMode && this.props.loggedIn ? {
      position: 'fixed',
      opacity: 0
    } : {paddingTop: '65px'}

    return (
      <div id="main-view" style={{backgroundColor: chatMode && '#fff'}}>
        <Header
          location={location}
          staticTop={chatMode}
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
            style={{paddingTop: '5px'}}
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
