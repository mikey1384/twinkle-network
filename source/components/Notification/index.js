import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addEvent, removeEvent } from 'helpers/listenerHelpers'
import NotiFeeds from './NotiFeeds'
import ChatFeeds from './ChatFeeds'
import { defaultChatSubject } from 'constants/defaultValues'
import { fetchNotifications } from 'redux/actions/NotiActions'
import ExecutionEnvironment from 'exenv'
import { container } from './Styles'
import FilterBar from 'components/FilterBar'
import { css } from 'emotion'

class Notification extends Component {
  static propTypes = {
    chatMode: PropTypes.bool.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    currentChatSubject: PropTypes.object,
    fetchNotifications: PropTypes.func.isRequired,
    myId: PropTypes.number,
    notifications: PropTypes.array.isRequired,
    rewards: PropTypes.array.isRequired,
    style: PropTypes.object,
    position: PropTypes.string
  }

  state = {
    notiTabActive: true
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
      children,
      rewards
    } = this.props
    const { notiTabActive } = this.state
    return (
      <div className={`${container} ${className}`} onScroll={this.handleScroll}>
        <section>
          <div
            className={css`
              display: flex;
              flex-direction: column;
              align-items: center;
            `}
          >
            {children && children}
          </div>
          {loaded && (
            <ChatFeeds
              content={content}
              style={{ marginTop: children ? '1rem' : '0' }}
              {...subject}
            />
          )}
          <FilterBar bordered style={{ marginTop: '1rem' }}>
            <nav
              className={notiTabActive ? 'active' : undefined}
              onClick={() => this.setState({ notiTabActive: true })}
            >
              <a>Notifications</a>
            </nav>
            <nav
              className={!notiTabActive ? 'active' : undefined}
              onClick={() => this.setState({ notiTabActive: false })}
            >
              <a>Rewards</a>
            </nav>
          </FilterBar>
          {notifications.length > 0 && (
            <NotiFeeds
              notiTabActive={notiTabActive}
              notifications={notifications}
              rewards={rewards}
              selectNotiTab={() => this.setState({ notiTabActive: true })}
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
    rewards: state.NotiReducer.rewards,
    currentChatSubject: state.NotiReducer.currentChatSubject
  }),
  { fetchNotifications }
)(Notification)
