import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {timeSince} from 'helpers/timeStampHelpers'
import {Color} from 'constants/css'
import ContentLink from 'components/ContentLink'
import UsernameText from 'components/Texts/UsernameText'
import {cleanStringWithURL} from 'helpers/stringHelpers'

export default class NotiFeeds extends Component {
  static propTypes = {
    notifications: PropTypes.array,
    myId: PropTypes.number,
    style: PropTypes.object
  }

  constructor() {
    super()
    this.renderNotificationMessage = this.renderNotificationMessage.bind(this)
  }

  render() {
    const {notifications, style} = this.props
    return (
      <div style={style}>
        <h4
          style={{
            fontWeight: 'bold',
            marginTop: '0px',
            textAlign: 'center'
          }}
        >
          Other Notifications
        </h4>
        <ul
          className="list-group"
        >
          {notifications.length > 0 && notifications.map(notification => {
            return <li
              className="list-group-item"
              style={{wordWrap: 'break-word'}}
              key={notification.id}>
              {this.renderNotificationMessage(notification)}
              <small style={{color: Color.gray}}>{timeSince(notification.timeStamp)}</small>
            </li>
          })}
        </ul>
      </div>
    )
  }

  renderNotificationMessage({
    type, rootType, rootRootType,
    rootTitle, rootId, rootRootId,
    userId, username, commentContent,
    rootCommentUploader, discussionTitle,
    discussionUploader
  }) {
    const {myId} = this.props
    let action = ''
    let isReplyNotification = commentContent && rootCommentUploader === myId
    let isDiscussionAnswerNotification = discussionTitle && discussionUploader === myId
    if (isReplyNotification) {
      action = 'replied to'
    } else if (isDiscussionAnswerNotification) {
      action = 'commented on'
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
    action += ` your ${isReplyNotification ? 'comment' :
      (isDiscussionAnswerNotification ? 'discussion topic' : rootType)}: `
    let contentTitle = isReplyNotification ?
      commentContent : (
        isDiscussionAnswerNotification ? discussionTitle : rootTitle
      ) || ''
    contentTitle = cleanStringWithURL(contentTitle)
    let title = contentTitle.length > 50 ? contentTitle.substr(0, 50) + '...' : contentTitle
    if (isReplyNotification) title = `"${title}"`
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
