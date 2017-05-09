import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {fetchNotifications} from 'redux/actions/NotiActions'
import UsernameText from 'components/Texts/UsernameText'
import {Color} from 'constants/css'
import ContentLink from '../ContentLink'

@connect(
  state => ({
    notifications: state.NotiReducer.notifications
  }),
  {fetchNotifications}
)
export default class Notification extends Component {
  static propTypes = {
    notifications: PropTypes.array,
    fetchNotifications: PropTypes.func,
    lockPageScroll: PropTypes.func,
    unlockPageScroll: PropTypes.func
  }

  componentDidMount() {
    const {fetchNotifications} = this.props
    fetchNotifications()
  }

  render() {
    const {notifications, lockPageScroll, unlockPageScroll} = this.props
    return (
      <div
        className="well"
        onScroll={() => lockPageScroll()}
        onMouseLeave={() => unlockPageScroll()}
        style={{
          maxHeight: '300px',
          overflowY: 'scroll'
        }}
      >
        <h4
          style={{
            fontWeight: 'bold',
            marginTop: '0px',
            textAlign: 'center'
          }}
        >
          Notifications
        </h4>
        <ul
          className="list-group"
        >
          {notifications.length > 0 && notifications.map(notification => {
            return <li
              className="list-group-item"
              key={notification.id}>
              {this.renderNotificationMessage(notification)}
            </li>
          })}
        </ul>
      </div>
    )
  }

  renderNotificationMessage(notification) {
    let action = ''
    switch (notification.type) {
      case 'like':
        action = 'likes'
        break
      case 'comment':
        action = 'commented on'
        break
      case 'discussion':
        action = 'added a discussion to'
        break
      default: break
    }
    action += ` your ${notification.rootType}: `
    let title = notification.rootTitle.length > 50 ? notification.rootTitle.substr(0, 50) + '...' : notification.rootTitle
    const content = {
      title,
      id: notification.rootType === 'comment' ?
        notification.rootRootId : notification.rootId
    }
    const type = notification.rootType === 'comment' ? notification.rootRootType : notification.rootType
    return <div>
      <UsernameText user={{id: notification.userId, name: notification.username}} color={Color.blue} />
      &nbsp;{action}
      <ContentLink content={content} type={type} />
    </div>
  }
}
