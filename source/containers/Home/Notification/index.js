import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {fetchNotifications} from 'redux/actions/NotiActions'
import UsernameText from 'components/Texts/UsernameText'
import {Color} from 'constants/css'
import ContentLink from '../ContentLink'
import {addEvent, removeEvent} from 'helpers/listenerHelpers'

@connect(
  state => ({
    chatMode: state.ChatReducer.chatMode,
    notifications: state.NotiReducer.notifications
  }),
  {
    fetchNotifications
  }
)
export default class Notification extends Component {
  static propTypes = {
    chatMode: PropTypes.bool,
    notifications: PropTypes.array,
    fetchNotifications: PropTypes.func
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
    const {fetchNotifications} = this.props
    fetchNotifications()
    addEvent(window, 'mousemove', this.onMouseMove)
    addEvent(window, 'scroll', this.onPageScroll)
  }

  componentWillUnmount() {
    removeEvent(window, 'mousemove', this.onMouseMove)
    removeEvent(window, 'scroll', this.onPageScroll)
  }

  render() {
    const {notifications} = this.props
    return (
      <div
        className="well"
        onScroll={this.handleScroll}
        style={{
          maxHeight: '300px',
          overflowY: 'scroll'
        }}
        ref={ref => { this.NotificationBox = ref }}
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
