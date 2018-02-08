import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import NotiFeeds from './NotiFeeds'
import ChatFeeds from './ChatFeeds'
import { defaultChatSubject } from 'constants/defaultValues'
import { fetchNotifications } from 'redux/actions/NotiActions'

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

  componentDidMount() {
    const { fetchNotifications } = this.props
    fetchNotifications()
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
      <div
        className={className}
        style={{
          position: 'fixed',
          overflowY: 'scroll',
          top: '65px',
          bottom: 0
        }}
      >
        <div className="well">
          <div>
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
