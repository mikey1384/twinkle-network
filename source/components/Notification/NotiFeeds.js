import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { timeSince } from 'helpers/timeStampHelpers'
import { Color } from 'constants/css'
import ContentLink from 'components/ContentLink'
import UsernameText from 'components/Texts/UsernameText'
import RoundList from 'components/RoundList'
import Banner from 'components/Banner'
import { fetchNotifications } from 'redux/actions/NotiActions'
import { connect } from 'react-redux'

class NotiFeeds extends Component {
  static propTypes = {
    fetchNotifications: PropTypes.func.isRequired,
    myId: PropTypes.number,
    numNewNotis: PropTypes.number,
    notifications: PropTypes.arrayOf(
      PropTypes.shape({
        contentId: PropTypes.number,
        commentContent: PropTypes.string,
        discussionId: PropTypes.number,
        discussionTitle: PropTypes.string,
        discussionUploader: PropTypes.number,
        id: PropTypes.number.isRequired,
        rootCommentUploader: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string
        ]),
        rootTitle: PropTypes.string.isRequired,
        rootType: PropTypes.string.isRequired,
        rootId: PropTypes.number.isRequired,
        timeStamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        type: PropTypes.string.isRequired,
        userId: PropTypes.number.isRequired,
        username: PropTypes.string.isRequired
      })
    ).isRequired,
    style: PropTypes.object
  }

  render() {
    const {
      myId,
      fetchNotifications,
      notifications,
      numNewNotis,
      style
    } = this.props
    return (
      <div style={style}>
        <RoundList>
          {numNewNotis > 0 && (
            <Banner
              love
              style={{ marginBottom: '1rem' }}
              onClick={fetchNotifications}
            >
              Click to See {numNewNotis} New Notification{numNewNotis > 1
                ? 's'
                : ''}
            </Banner>
          )}
          {notifications.length > 0 &&
            notifications.map(notification => {
              return (
                <li
                  style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word'
                  }}
                  key={notification.id}
                >
                  {renderNotificationMessage(notification, myId)}
                  <small style={{ color: Color.gray() }}>
                    {timeSince(notification.timeStamp)}
                  </small>
                </li>
              )
            })}
        </RoundList>
      </div>
    )
  }
}

export default connect(
  state => ({
    numNewNotis: state.NotiReducer.numNewNotis
  }),
  { fetchNotifications }
)(NotiFeeds)

function renderNotificationMessage(notification, myId) {
  const {
    contentId,
    discussionId,
    type,
    rootType,
    rootTitle,
    rootId,
    userId,
    username,
    commentContent,
    rootCommentUploader,
    discussionTitle,
    discussionUploader
  } = notification
  let action = ''
  let isReplyNotification = commentContent && rootCommentUploader === myId
  let isDiscussionAnswerNotification =
    discussionTitle && discussionUploader === myId
  if (isReplyNotification) {
    action = returnCommentActionText('reply')
  } else if (isDiscussionAnswerNotification) {
    action = returnCommentActionText('comment')
  } else {
    switch (type) {
      case 'like':
        action = 'likes'
        break
      case 'comment':
        action =
          rootType === 'question'
            ? returnCommentActionText('answer')
            : returnCommentActionText('comment')
        break
      case 'discussion':
        action = 'added a discussion to'
        break
      default:
        break
    }
  }
  const target = `your ${
    isReplyNotification
      ? 'comment'
      : isDiscussionAnswerNotification
        ? 'discussion topic'
        : rootType
  }: `
  let contentTitle = isReplyNotification
    ? commentContent
    : (isDiscussionAnswerNotification ? discussionTitle : rootTitle) || ''
  let title =
    contentTitle.length > 50 ? contentTitle.substr(0, 50) + '...' : contentTitle
  if (isReplyNotification) title = `"${title}"`
  const content = {
    title,
    id: isReplyNotification
      ? contentId
      : type === 'discussion'
        ? contentId
        : isDiscussionAnswerNotification
          ? discussionId
          : rootId
  }
  return (
    <div>
      <UsernameText
        user={{ id: userId, name: username }}
        color={Color.blue()}
      />
      &nbsp;{action} {target}
      <ContentLink
        content={content}
        type={
          isReplyNotification
            ? 'comment'
            : type === 'discussion' || isDiscussionAnswerNotification
              ? 'discussion'
              : rootType
        }
      />
    </div>
  )

  function returnCommentActionText(type) {
    const title =
      type === 'comment'
        ? 'commented on'
        : type === 'reply'
          ? 'replied to'
          : 'answered'
    return (
      <ContentLink
        style={{ color: Color.green() }}
        content={{ id: contentId, title }}
        type="comment"
      />
    )
  }
}
