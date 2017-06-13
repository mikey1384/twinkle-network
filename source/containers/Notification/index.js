import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {addEvent, removeEvent} from 'helpers/listenerHelpers'
import NotiFeeds from './NotiFeeds'
import ChatFeeds from './ChatFeeds'
import {defaultChatSubject} from 'constants/defaultValues'
import Responsive from 'components/Wrappers/Responsive'

@connect(
  state => ({
    chatMode: state.ChatReducer.chatMode,
    myId: state.UserReducer.userId,
    notifications: state.NotiReducer.notifications,
    currentChatSubject: state.NotiReducer.currentChatSubject
  })
)
export default class Notification extends Component {
  static propTypes = {
    myId: PropTypes.number,
    chatMode: PropTypes.bool,
    currentChatSubject: PropTypes.object,
    notifications: PropTypes.array,
    children: PropTypes.node
  }

  constructor() {
    super()
    this.state = {
      scrollPosition: window.scrollY,
      scrollLocked: false
    }
    this.handleScroll = this.handleScroll.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onPageScroll = this.onPageScroll.bind(this)
  }

  componentDidMount() {
    addEvent(window, 'mousemove', this.onMouseMove)
    addEvent(window, 'scroll', this.onPageScroll)
  }

  componentWillUnmount() {
    removeEvent(window, 'mousemove', this.onMouseMove)
    removeEvent(window, 'scroll', this.onPageScroll)
  }

  render() {
    const {
      notifications, myId,
      currentChatSubject: {
        content = defaultChatSubject,
        userId, username, timeStamp,
        loaded
      },
      children
    } = this.props
    return (
      <div
        className="col-xs-3 col-xs-offset-9"
        style={{position: 'fixed'}}
      >
        <Responsive device="desktop">
          <div>
            {children &&
              <div style={{minHeight: '3em', marginBottom: '1em'}}>
                {children}
              </div>
            }
            <div
              className="well"
              onScroll={this.handleScroll}
              style={{
                maxHeight: '30em',
                overflowY: 'scroll'
              }}
              ref={ref => { this.NotificationBox = ref }}
            >
              {loaded && <ChatFeeds content={content} userId={userId} username={username} timeStamp={timeStamp} />}
              {notifications.length > 0 && <NotiFeeds notifications={notifications} myId={myId} style={{marginTop: loaded && '1.5em'}} />}
            </div>
          </div>
        </Responsive>
      </div>
    )
  }

  handleScroll() {
    const {scrollHeight, clientHeight, scrollTop} = this.NotificationBox
    if (scrollTop === 0 || scrollHeight - clientHeight === scrollTop) {
      this.setState({scrollLocked: true})
    } else {
      this.setState({scrollLocked: false})
    }
  }

  onMouseMove() {
    const {scrollLocked} = this.state
    if (scrollLocked) this.setState({scrollLocked: false})
  }

  onPageScroll() {
    const {chatMode} = this.props
    const {scrollLocked} = this.state
    if (scrollLocked) {
      window.scrollTo(0, this.state.scrollPosition)
    }
    if (!chatMode) {
      this.setState({scrollPosition: window.scrollY})
    }
  }
}
