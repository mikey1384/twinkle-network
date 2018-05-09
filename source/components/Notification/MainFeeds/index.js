import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { timeSince } from 'helpers/timeStampHelpers'
import { Color } from 'constants/css'
import ContentLink from 'components/ContentLink'
import UsernameText from 'components/Texts/UsernameText'
import RoundList from 'components/RoundList'
import Banner from 'components/Banner'
import Button from 'components/Button'
import {
  clearRewards,
  fetchNotifications,
  loadMoreNotifications,
  loadMoreRewards
} from 'redux/actions/NotiActions'
import { changeUserXP } from 'redux/actions/UserActions'
import { connect } from 'react-redux'
import LeaderBoardTab from './LeaderBoardTab'
import { addCommasToNumber } from 'helpers/stringHelpers'
import { notiFeedListItem } from '../Styles'
import { rewardValue } from 'constants/defaultValues'

class MainFeeds extends Component {
  static propTypes = {
    changeUserXP: PropTypes.func.isRequired,
    fetchNotifications: PropTypes.func.isRequired,
    loadMore: PropTypes.object.isRequired,
    loadMoreNotifications: PropTypes.func.isRequired,
    loadMoreRewards: PropTypes.func.isRequired,
    myId: PropTypes.number,
    numNewNotis: PropTypes.number,
    activeTab: PropTypes.string,
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
    style: PropTypes.object,
    totalRewardAmount: PropTypes.number,
    twinkleXP: PropTypes.number
  }

  state = {
    loading: false,
    originalTotalReward: 0,
    originalTwinkleXP: 0
  }

  render() {
    const {
      myId,
      loadMore,
      activeTab,
      notifications,
      numNewNotis,
      rewards,
      style,
      totalRewardAmount
    } = this.props
    const { loading } = this.state
    const { originalTotalReward, originalTwinkleXP } = this.state
    return (
      <div style={style}>
        <RoundList style={{ marginTop: '0' }}>
          {numNewNotis > 0 && (
            <Banner
              love
              style={{ marginBottom: '1rem' }}
              onClick={this.onNewNotiAlertClick}
            >
              Tap to See {numNewNotis} New Notification{numNewNotis > 1
                ? 's'
                : ''}
            </Banner>
          )}
          {activeTab === 'reward' && (
            <Banner
              love={totalRewardAmount > 0}
              success={totalRewardAmount === 0}
              style={{ marginBottom: '1rem' }}
              onClick={totalRewardAmount > 0 ? this.onCollectReward : null}
            >
              {totalRewardAmount > 0 && (
                <Fragment>
                  <p>Tap to collect all your rewards</p>
                  <p>
                    ({totalRewardAmount} stars x {rewardValue.star} XP/star ={' '}
                    {addCommasToNumber(totalRewardAmount * rewardValue.star)}{' '}
                    XP)
                  </p>
                </Fragment>
              )}
              {totalRewardAmount === 0 && (
                <Fragment>
                  <p>{originalTotalReward * rewardValue.star} XP Collected!</p>
                  <p>
                    Your XP went up from {addCommasToNumber(originalTwinkleXP)}{' '}
                    to{' '}
                    {addCommasToNumber(
                      originalTwinkleXP + originalTotalReward * rewardValue.star
                    )}
                  </p>
                </Fragment>
              )}
            </Banner>
          )}
          {activeTab === 'notification' &&
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
          {activeTab === 'leaderboard' && <LeaderBoardTab myId={myId} />}
          {activeTab === 'reward' &&
            rewards.map(
              ({
                id,
                contentId,
                contentType,
                rewardAmount,
                rewardType,
                rewarderId,
                rewarderUsername,
                timeStamp
              }) => (
                <li className={notiFeedListItem} key={id}>
                  <div>
                    <UsernameText
                      user={{ id: rewarderId, name: rewarderUsername }}
                      color={Color.blue()}
                    />{' '}
                    <span
                      style={{
                        color: rewardAmount > 1 ? Color.gold() : Color.orange(),
                        fontWeight: 'bold'
                      }}
                    >
                      rewarded you {rewardAmount === 1 ? 'a' : rewardAmount}{' '}
                      {rewardType}
                      {rewardAmount > 1 ? 's' : ''}
                    </span>{' '}
                    for your{' '}
                    <ContentLink
                      style={{ color: Color.green() }}
                      content={{ id: contentId, title: contentType }}
                      type={contentType}
                    />
                  </div>
                  <small>{timeSince(timeStamp)}</small>
                </li>
              )
            )}
        </RoundList>
        {((activeTab === 'notification' && loadMore.notifications) ||
          (activeTab === 'reward' && loadMore.rewards)) && (
          <Button
            logo
            filled
            style={{
              marginTop: '1rem',
              width: '100%'
            }}
            disabled={loading}
            onClick={this.onLoadMore}
          >
            Load More
          </Button>
        )}
      </div>
    )
  }

  onCollectReward = async() => {
    const {
      changeUserXP,
      clearRewards,
      totalRewardAmount,
      twinkleXP
    } = this.props
    this.setState({
      originalTotalReward: totalRewardAmount,
      originalTwinkleXP: twinkleXP
    })
    await changeUserXP({
      action: 'collect'
    })
    clearRewards()
  }

  onNewNotiAlertClick = () => {
    const { selectNotiTab, fetchNotifications } = this.props
    selectNotiTab()
    fetchNotifications()
  }

  onLoadMore = async() => {
    const {
      notifications,
      rewards,
      loadMoreNotifications,
      loadMoreRewards,
      activeTab
    } = this.props
    this.setState({ loading: true })
    if (activeTab === 'notification') {
      await loadMoreNotifications(notifications[notifications.length - 1].id)
    } else {
      await loadMoreRewards(rewards[rewards.length - 1].id)
    }
    this.setState({ loading: false })
  }
}

export default connect(
  state => ({
    numNewNotis: state.NotiReducer.numNewNotis,
    totalRewardAmount: state.NotiReducer.totalRewardAmount,
    twinkleXP: state.UserReducer.twinkleXP
  }),
  {
    changeUserXP,
    clearRewards,
    fetchNotifications,
    loadMoreNotifications,
    loadMoreRewards
  }
)(MainFeeds)

function renderNotificationMessage(notification, myId) {
  const {
    contentId,
    discussionId,
    type,
    reward = {},
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
  let isReplyNotification =
    commentContent && Number(rootCommentUploader) === myId
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
