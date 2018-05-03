import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { timeSince } from 'helpers/timeStampHelpers'
import { Color } from 'constants/css'
import ContentLink from 'components/ContentLink'
import UsernameText from 'components/Texts/UsernameText'
import RoundList from 'components/RoundList'
import Banner from 'components/Banner'
import { fetchNotifications } from 'redux/actions/NotiActions'
import { connect } from 'react-redux'
import { notiFeedListItem } from './Styles'

class NotiFeeds extends Component {
  static propTypes = {
    fetchNotifications: PropTypes.func.isRequired,
    myId: PropTypes.number,
    numNewNotis: PropTypes.number,
    notiTabActive: PropTypes.bool,
    notifications: PropTypes.arrayOf(
      PropTypes.shape({
        contentId: PropTypes.number,
        commentContent: PropTypes.string,
        discussionId: PropTypes.number,
        discussionTitle: PropTypes.string,
        discussionUploader: PropTypes.number,
        id: PropTypes.number.isRequired,
        reward: PropTypes.object,
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
    rewards: PropTypes.array,
    selectNotiTab: PropTypes.func.isRequired,
    style: PropTypes.object
  }

  render() {
    const {
      myId,
      notiTabActive,
      notifications,
      numNewNotis,
      rewards,
      style
    } = this.props
    return (
      <div style={style}>
        <RoundList style={{ marginTop: '0' }}>
          {numNewNotis > 0 && (
            <Banner
              love
              style={{ marginBottom: '1rem' }}
              onClick={this.onBannerClick}
            >
              Click to See {numNewNotis} New Notification{numNewNotis > 1
                ? 's'
                : ''}
            </Banner>
          )}
          {notifications.length > 0 &&
            notiTabActive &&
            notifications.map(notification => {
              return (
                <li className={notiFeedListItem} key={notification.id}>
                  {renderNotificationMessage(notification, myId)}
                  <small style={{ color: Color.gray() }}>
                    {timeSince(notification.timeStamp)}
                  </small>
                </li>
              )
            })}
          {rewards.length > 0 &&
            !notiTabActive &&
            rewards.map(
              ({
                id,
                contentType,
                rewardAmount,
                rewardType,
                rewarderUsername,
                timeStamp
              }) => (
                <li className={notiFeedListItem} key={id}>
                  <p>
                    {rewarderUsername} rewarded you{' '}
                    {rewardAmount === 1 ? 'a' : rewardAmount} {rewardType}
                    {rewardAmount > 1 ? 's' : ''} for your {contentType}
                  </p>
                  <small>{timeSince(timeStamp)}</small>
                </li>
              )
            )}
        </RoundList>
      </div>
    )
  }

  onBannerClick = () => {
    const { selectNotiTab, fetchNotifications } = this.props
    selectNotiTab()
    fetchNotifications()
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
    reward,
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
      case 'reward':
        action = (
          <Fragment>
            <span
              style={{
                fontWeight: 'bold',
                color: reward.rewardAmount > 1 ? Color.gold() : Color.orange()
              }}
            >
              rewarded you{' '}
              {reward.rewardAmount === 1 ? 'a' : reward.rewardAmount}{' '}
              {reward.rewardType}
              {reward.rewardAmount > 1 ? 's' : ''}
            </span>{' '}
            for
          </Fragment>
        )
        break
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
