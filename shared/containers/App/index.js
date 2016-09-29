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
    this.state = {
      trackScroll: true,
      scrollPosition: 0
    }
    this.onChatButtonClick = this.onChatButtonClick.bind(this)
    this.onScroll = this.onScroll.bind(this)
  }

  componentDidUpdate(prevProps) {
    const {turnChatOff} = this.props;
    if (this.props.children !== prevProps.children) {
      this.setState({trackScroll: true})
      turnChatOff()
    }
  }

  componentDidMount() {
    if (ExecutionEnvironment.canUseDOM) {
      addEvent(window, 'scroll', this.onScroll);
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
          turnChatOff={() => {
            this.setState({trackScroll: true})
            turnChatOff()
          }}
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
                this.setState({trackScroll: true})
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
    const {trackScroll} = this.state;
    const {toggleChat, initChat} = this.props;

    this.setState({trackScroll: false})
    initChat(() => {
      toggleChat();
    })
  }

  onScroll() {
    const {trackScroll} = this.state;
    if (trackScroll) {
      this.setState({scrollPosition: window.scrollY})
    }
  }
}
