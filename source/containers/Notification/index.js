import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addEvent, removeEvent } from 'helpers/listenerHelpers'
import NotiFeeds from './NotiFeeds'
import ChatFeeds from './ChatFeeds'
import { defaultChatSubject } from 'constants/defaultValues'
import { fetchNotifications } from 'redux/actions/NotiActions'
import ExecutionEnvironment from 'exenv'

class Notification extends Component {
  static propTypes = {
    chatMode: PropTypes.bool.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    currentChatSubject: PropTypes.object,
    fetchNotifications: PropTypes.func.isRequired,
    myId: PropTypes.number,
    notifications: PropTypes.array.isRequired,
    position: PropTypes.string
  }

  scrollLocked = false

  state = {
    scrollPosition: ExecutionEnvironment.canUseDOM ? window.scrollY : 0
  }

  componentDidMount() {
    const { fetchNotifications } = this.props
    addEvent(window, 'mousemove', this.onMouseMove)
    addEvent(window, 'scroll', this.onPageScroll)
    fetchNotifications()
  }

  componentWillUnmount() {
    if (ExecutionEnvironment.canUseDOM) {
      removeEvent(window, 'mousemove', this.onMouseMove)
      removeEvent(window, 'scroll', this.onPageScroll)
    }
  }

  render() {
    const {
      notifications,
      myId,
      className,
      position = 'fixed',
      currentChatSubject: { content = defaultChatSubject, loaded, ...subject },
      children
    } = this.props
    return (
      <div
        className={className}
        style={{ position }}
        onScroll={this.handleScroll}
      >
        <div>
          <div
            className="well momentum-scroll-enabled"
            style={{ height: '92vh' }}
            ref={ref => {
              this.NotificationBox = ref
            }}
          >
            {children && (
              <div style={{ minHeight: '3rem', marginBottom: '1rem' }}>
                {children}
              </div>
            )}
            {loaded && <ChatFeeds content={content} {...subject} />}
            {notifications.length > 0 && (
              <NotiFeeds
                notifications={notifications}
                myId={myId}
                style={{ marginTop: loaded && '1em' }}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  handleScroll = () => {
    const { scrollHeight, clientHeight, scrollTop } = this.NotificationBox
    if (scrollTop === 0 || scrollHeight - clientHeight === scrollTop) {
      this.scrollLocked = true
    } else {
      this.scrollLocked = false
    }
  }

  onMouseMove = () => {
    this.scrollLocked = false
  }

  onPageScroll = () => {
    const { chatMode } = this.props
    if (this.scrollLocked) {
      window.scrollTo(0, this.state.scrollPosition)
    }
    if (!chatMode) {
      this.setState({ scrollPosition: window.scrollY })
    }
  }
}

export default connect(
  state => ({
    chatMode: state.ChatReducer.chatMode,
    myId: state.UserReducer.userId,
    notifications: state.NotiReducer.notifications,
    currentChatSubject: state.NotiReducer.currentChatSubject
  }),
  { fetchNotifications }
)(Notification)
