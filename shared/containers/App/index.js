import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import Chat from '../Chat';
import io from 'socket.io-client';
import {connect} from 'react-redux';
import {initChatAsync, resetChat, toggleChat, turnChatOff} from 'redux/actions/ChatActions';
import {initSessionAsync} from 'redux/actions/UserActions';
import {URL} from 'constants/URL';
import ExecutionEnvironment from 'exenv';
import {addEvent, removeEvent} from 'helpers/listenerHelpers';


const socket = io.connect(URL);

@connect(
  state => ({
    loggedIn: state.UserReducer.loggedIn,
    chatMode: state.ChatReducer.chatMode,
    chatNumUnreads: state.ChatReducer.numUnreads
  }),
  {
    initSession: initSessionAsync,
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
    this.state = {
      scrollPosition: 0
    }
    this.onChatButtonClick = this.onChatButtonClick.bind(this)
    this.onScroll = this.onScroll.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.chatMode && !!nextProps.chatMode) window.scrollTo(0, 0)
  }

  componentDidMount() {
    const {initSession} = this.props;
    if (ExecutionEnvironment.canUseDOM) {
      initSession();
      addEvent(window, 'scroll', this.onScroll);
    }
  }

  componentDidUpdate(prevProps) {
    const {turnChatOff} = this.props;
    if (this.props.children !== prevProps.children) turnChatOff()
    if (this.props.chatNumUnreads !== prevProps.chatNumUnreads) {
      const {chatMode, chatNumUnreads} = this.props;
      let title = '';
      if (!!chatMode) {
        title = "Twinkle Chat"
      } else {
        title = `${chatNumUnreads > 0 ? '('+chatNumUnreads+') ' : ''}Twinkle`;
      }
      document.title = title;
    }

    if (this.props.chatMode !== prevProps.chatMode) {
      const {chatMode, chatNumUnreads} = this.props;
      let title = '';
      if (!!chatMode) {
        title = "Twinkle Chat"
      } else {
        title = `${chatNumUnreads > 0 ? '('+chatNumUnreads+') ' : ''}Twinkle`;
      }
      document.title = title;
    }
  }

  componentWillUnmount() {
    if (ExecutionEnvironment.canUseDOM) {
      removeEvent(window, 'scroll', this.onScroll);
    }
  }

  render() {
    const {chatMode, turnChatOff, location, params} = this.props;
    const {scrollPosition} = this.state;
    const style = chatMode && this.props.loggedIn ? {
      display: 'none'
    } : {paddingTop: '65px'}

    return (
      <div
        id="main-view"
        style={{backgroundColor: chatMode && '#fff'}}
        ref="app"
      >
        <Header
          location={params.username || !location.pathname.split('/')[1] ? null : location.pathname.split('/')[1]}
          staticTop={chatMode}
          socket={socket}
          chatMode={chatMode}
          onChatButtonClick={this.onChatButtonClick}
          turnChatOff={() => turnChatOff()}
        />
        <div
          style={{...style, paddingBottom: '1em'}}
        >
          {this.props.children}
        </div>
        {chatMode && this.props.loggedIn &&
          <Chat
            socket={socket}
            onUnmount={
              () => {
                window.scrollTo(0, scrollPosition)
                this.props.resetChat();
                turnChatOff();
              }
            }
          />
        }
      </div>
    )
  }

  onChatButtonClick() {
    const {toggleChat, initChat} = this.props;
    initChat(() => {
      toggleChat();
    })
  }

  onScroll() {
    const {chatMode} = this.props;
    if (!chatMode) {
      this.setState({scrollPosition: window.scrollY})
    }
  }
}
