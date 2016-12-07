import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Header from '../Header';
import Chat from '../Chat';
import io from 'socket.io-client';
import {connect} from 'react-redux';
import {initChatAsync, resetChat, toggleChat, turnChatOff} from 'redux/actions/ChatActions';
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

  componentDidMount() {
    if (ExecutionEnvironment.canUseDOM) {
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
    const {chatMode, turnChatOff, location} = this.props;
    const {scrollPosition} = this.state;
    const style = chatMode && this.props.loggedIn ? {
      position: 'fixed',
      opacity: 0
    } : {paddingTop: '65px'}

    return (
      <div
        id="main-view"
        style={{backgroundColor: chatMode && '#fff'}}
        ref="app"
      >
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
                window.scrollTo(0, scrollPosition)
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
