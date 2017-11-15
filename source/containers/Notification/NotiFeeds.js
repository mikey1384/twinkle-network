import React from 'react'
import PropTypes from 'prop-types'
import {timeSince} from 'helpers/timeStampHelpers'
import {Color} from 'constants/css'
import ContentLink from 'components/ContentLink'
import UsernameText from 'components/Texts/UsernameText'

NotiFeeds.propTypes = {
  myId: PropTypes.number,
  notifications: PropTypes.arrayOf(PropTypes.shape({
    commentContent: PropTypes.string,
    discussionTitle: PropTypes.string,
    discussionUploader: PropTypes.number,
    id: PropTypes.number.isRequired,
    rootCommentUploader: PropTypes.number,
    rootRootType: PropTypes.string,
    rootTitle: PropTypes.string.isRequired,
    rootType: PropTypes.string.isRequired,
    rootId: PropTypes.number.isRequired,
    rootRootId: PropTypes.number,
    timeStamp: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    type: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired
  })).isRequired,
  style: PropTypes.object
}
export default function NotiFeeds({myId, notifications, style}) {
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
            style={{wordBreak: 'break-word'}}
            key={notification.id}>
            {renderNotificationMessage(notification, myId)}
            <small style={{color: Color.gray}}>{timeSince(notification.timeStamp)}</small>
          </li>
        })}
      </ul>
    </div>
  )
}

function renderNotificationMessage(notification, myId) {
  const {
    type, rootType, rootRootType,
    rootTitle, rootId, rootRootId,
    userId, username, commentContent,
    rootCommentUploader, discussionTitle,
    discussionUploader
  } = notification

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
        action = rootType === 'question' ? 'answered' : 'commented on'
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
