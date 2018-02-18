import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addEvent, removeEvent } from 'helpers/listenerHelpers'
import NotiFeeds from './NotiFeeds'
import ChatFeeds from './ChatFeeds'
import { defaultChatSubject } from 'constants/defaultValues'
import { fetchNotifications } from 'redux/actions/NotiActions'
import ExecutionEnvironment from 'exenv'
import { styles } from './styles'

class Notification extends Component {
  static propTypes = {
    chatMode: PropTypes.bool.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    currentChatSubject: PropTypes.object,
    fetchNotifications: PropTypes.func.isRequired,
    myId: PropTypes.number,
    notifications: PropTypes.array.isRequired,
    style: PropTypes.object,
    position: PropTypes.string
  }

  componentDidMount() {
    const { fetchNotifications } = this.props
    addEvent(window, 'mousemove', this.onMouseMove)
    fetchNotifications()
  }

  componentWillUnmount() {
    if (ExecutionEnvironment.canUseDOM) {
      removeEvent(window, 'mousemove', this.onMouseMove)
    }
  }

  render() {
    const {
      notifications,
      myId,
      className,
      currentChatSubject: { content = defaultChatSubject, loaded, ...subject },
      children
    } = this.props
    return (
      <div className={`${styles} ${className}`} onScroll={this.handleScroll}>
        <section className="momentum-scroll-enabled">
          {children && <div style={{ minHeight: '3rem' }}>{children}</div>}
          {loaded && (
            <ChatFeeds
              content={content}
              style={{ marginTop: !!children && '1rem' }}
              {...subject}
            />
          )}
          {notifications.length > 0 && (
            <NotiFeeds
              notifications={notifications}
              myId={myId}
              style={{ marginTop: loaded && '1rem' }}
            />
          )}
        </section>
      </div>
    )
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
