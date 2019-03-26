import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ContentLink from 'components/ContentLink';
import UsernameText from 'components/Texts/UsernameText';
import RoundList from 'components/RoundList';
import Banner from 'components/Banner';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Rankings from './Rankings';
import NotiItem from './NotiItem';
import MyRank from './MyRank';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import {
  clearRewards,
  fetchNotifications,
  loadMoreNotifications,
  loadMoreRewards
} from 'redux/actions/NotiActions';
import { timeSince } from 'helpers/timeStampHelpers';
import { Color } from 'constants/css';
import { changeUserXP } from 'redux/actions/UserActions';
import { connect } from 'react-redux';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { notiFeedListItem } from '../Styles';
import { rewardValue } from 'constants/defaultValues';

MainFeeds.propTypes = {
  clearRewards: PropTypes.func.isRequired,
  changeUserXP: PropTypes.func.isRequired,
  fetchNotifications: PropTypes.func.isRequired,
  loadMore: PropTypes.object.isRequired,
  loadMoreNotifications: PropTypes.func.isRequired,
  loadMoreRewards: PropTypes.func.isRequired,
  numNewNotis: PropTypes.number,
  activeTab: PropTypes.string,
  notifications: PropTypes.array.isRequired,
  rank: PropTypes.number,
  rewards: PropTypes.array,
  selectNotiTab: PropTypes.func.isRequired,
  style: PropTypes.object,
  totalRewardAmount: PropTypes.number,
  twinkleXP: PropTypes.number,
  userId: PropTypes.number
};

function MainFeeds({
  activeTab,
  changeUserXP,
  clearRewards,
  fetchNotifications,
  loadMore,
  loadMoreNotifications,
  loadMoreRewards,
  notifications,
  numNewNotis,
  rank,
  rewards,
  selectNotiTab,
  style,
  totalRewardAmount,
  twinkleXP,
  userId
}) {
  const [loading, setLoading] = useState(false);
  const [originalTotalReward, setOriginalTotalReward] = useState(0);
  const [originalTwinkleXP, setOriginalTwinkleXP] = useState(0);

  return (
    <ErrorBoundary style={style}>
      {numNewNotis > 0 && (
        <Banner
          color="gold"
          style={{ marginBottom: '1rem' }}
          onClick={onNewNotiAlertClick}
        >
          Tap to See {numNewNotis} New Notification
          {numNewNotis > 1 ? 's' : ''}
        </Banner>
      )}
      {activeTab === 'reward' && (
        <Banner
          color={totalRewardAmount > 0 ? 'gold' : 'green'}
          style={{ marginBottom: '1rem' }}
          onClick={totalRewardAmount > 0 ? onCollectReward : null}
        >
          {totalRewardAmount > 0 && (
            <>
              <p>Tap to collect all your rewards</p>
              <p>
                ({totalRewardAmount} Twinkles x {rewardValue.star} XP/Twinkle ={' '}
                {addCommasToNumber(totalRewardAmount * rewardValue.star)} XP)
              </p>
            </>
          )}
          {totalRewardAmount === 0 && (
            <>
              <p>{originalTotalReward * rewardValue.star} XP Collected!</p>
              <p>
                Your XP: {addCommasToNumber(originalTwinkleXP)} {'=>'}{' '}
                {addCommasToNumber(
                  originalTwinkleXP + originalTotalReward * rewardValue.star
                )}
              </p>
            </>
          )}
        </Banner>
      )}
      {activeTab === 'reward' && !!userId && (
        <MyRank myId={userId} rank={rank} twinkleXP={twinkleXP} />
      )}
      {userId && activeTab === 'notification' && notifications.length > 0 && (
        <RoundList style={{ marginTop: 0 }}>
          {notifications.map(notification => {
            return (
              <li
                style={{ background: '#fff' }}
                className={notiFeedListItem}
                key={notification.id}
              >
                <NotiItem notification={notification} />
              </li>
            );
          })}
        </RoundList>
      )}
      {activeTab === 'rankings' && <Rankings />}
      {activeTab === 'reward' && rewards.length > 0 && (
        <RoundList style={{ marginTop: 0 }}>
          {rewards.map(
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
              <li
                style={{ background: '#fff' }}
                className={notiFeedListItem}
                key={id}
              >
                <div>
                  <UsernameText
                    user={{ id: rewarderId, username: rewarderUsername }}
                    color={Color.blue()}
                  />{' '}
                  <span
                    style={{
                      color:
                        rewardAmount === 25
                          ? Color.gold()
                          : rewardAmount >= 10
                          ? Color.rose()
                          : rewardAmount >= 5
                          ? Color.orange()
                          : rewardAmount >= 3
                          ? Color.pink()
                          : Color.lightBlue(),
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
                    content={{
                      id: contentId,
                      title: contentType
                    }}
                    type={contentType}
                  />
                </div>
                <small>{timeSince(timeStamp)}</small>
              </li>
            )
          )}
        </RoundList>
      )}
      {((activeTab === 'notification' && loadMore.notifications) ||
        (activeTab === 'reward' && loadMore.rewards)) &&
        !!userId && (
          <LoadMoreButton
            style={{ marginTop: '1rem' }}
            loading={loading}
            color="lightBlue"
            filled
            stretch
            onClick={onLoadMore}
          />
        )}
    </ErrorBoundary>
  );

  async function onCollectReward() {
    setOriginalTotalReward(totalRewardAmount);
    setOriginalTwinkleXP(twinkleXP);
    await changeUserXP({
      action: 'collect'
    });
    clearRewards();
  }

  async function onNewNotiAlertClick() {
    await fetchNotifications();
    selectNotiTab();
  }

  async function onLoadMore() {
    setLoading(true);
    if (activeTab === 'notification') {
      await loadMoreNotifications(notifications[notifications.length - 1].id);
    } else {
      await loadMoreRewards(rewards[rewards.length - 1].id);
    }
    setLoading(false);
  }
}

export default connect(
  state => ({
    numNewNotis: state.NotiReducer.numNewNotis,
    totalRewardAmount: state.NotiReducer.totalRewardAmount,
    rank: state.UserReducer.rank,
    twinkleXP: state.UserReducer.twinkleXP,
    userId: state.UserReducer.userId
  }),
  {
    changeUserXP,
    clearRewards,
    fetchNotifications,
    loadMoreNotifications,
    loadMoreRewards
  }
)(MainFeeds);
