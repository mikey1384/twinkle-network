import React, {Component, PropTypes} from 'react';
import Header from './Header';
import Chat from '../Chat';
import io from 'socket.io-client';
import {connect} from 'react-redux';
import {initChatAsync, resetChat, turnChatOff} from 'redux/actions/ChatActions';
import {initSessionAsync} from 'redux/actions/UserActions';
import {URL} from 'constants/URL';
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
    initSession();
    addEvent(window, 'scroll', this.onScroll);
  }

  componentDidUpdate(prevProps) {
    const {turnChatOff} = this.props;
    let elements = document.documentElement.childNodes;
    if (this.props.children !== prevProps.children) turnChatOff()
    if (this.props.chatNumUnreads !== prevProps.chatNumUnreads) {
      const {chatMode, chatNumUnreads} = this.props;
      let title = '', display = '';
      if (!!chatMode) {
        title = "Twinkle Chat";
        display = 'none';
      } else {
        title = `${chatNumUnreads > 0 ? '('+chatNumUnreads+') ' : ''}Twinkle`;
        display = 'inline';
      }
      document.title = title;
      for (let i = 0; i < elements.length; i++)
        if (elements[i].tagName === "GRAMMARLY-CARD") elements[i].style.display = display;
    }

    if (this.props.chatMode !== prevProps.chatMode) {
      const {chatMode, chatNumUnreads} = this.props;
      let title = '', display = '';
      if (!!chatMode) {
        title = "Twinkle Chat";
        display = 'none';
      } else {
        title = `${chatNumUnreads > 0 ? '('+chatNumUnreads+') ' : ''}Twinkle`;
        display = 'inline';
      }
      document.title = title;
      for (let i = 0; i < elements.length; i++)
        if (elements[i].tagName === "GRAMMARLY-CARD") elements[i].style.display = display;
    }
  }

  componentWillUnmount() {
    removeEvent(window, 'scroll', this.onScroll);
  }

  render() {
    const {chatMode, turnChatOff, resetChat, location, params} = this.props;
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
          onProfilePage={!!params.username}
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
                resetChat();
                turnChatOff();
              }
            }
          />
        }
      </div>
    )
  }

  onChatButtonClick() {
    const {initChat, chatMode, turnChatOff} = this.props;
    if (!!chatMode) return turnChatOff()
    initChat()
  }

  onScroll() {
    const {chatMode} = this.props;
    if (!chatMode) {
      this.setState({scrollPosition: window.scrollY})
    }
  }
}
