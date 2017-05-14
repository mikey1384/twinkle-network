import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {fetchNotifications} from 'redux/actions/NotiActions'
import UsernameText from 'components/Texts/UsernameText'
import {Color} from 'constants/css'
import ContentLink from '../ContentLink'
import {addEvent, removeEvent} from 'helpers/listenerHelpers'
import {timeSince} from 'helpers/timeStampHelpers'

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
              <small style={{color: Color.gray}}>{timeSince(notification.timeStamp)}</small>
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

  renderNotificationMessage({
    type, rootType, rootRootType,
    rootTitle, rootId, rootRootId,
    userId, username, commentContent
  }) {
    let action = ''
    if (commentContent) {
      action = 'replied to'
    } else {
      switch (type) {
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
    }
    action += ` your ${commentContent ? 'comment' : rootType}: `
    let contentTitle = commentContent || rootTitle
    let title = contentTitle.length > 50 ? contentTitle.substr(0, 50) + '...' : contentTitle
    if (commentContent) title = `"${title}"`
    const content = {
      title,
      id: rootType === 'comment' ? rootRootId : rootId
    }
    const contentType = rootType === 'comment' ? rootRootType : rootType
    return <div>
      <UsernameText user={{id: userId, name: username}} color={Color.blue} />
      &nbsp;{action}
      <ContentLink content={content} type={contentType} />
    </div>
  }
}
