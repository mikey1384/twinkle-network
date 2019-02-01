import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { timeSince } from 'helpers/timeStampHelpers';
import { Color } from 'constants/css';
import ContentLink from 'components/ContentLink';
import UsernameText from 'components/Texts/UsernameText';
import RoundList from 'components/RoundList';
import Banner from 'components/Banner';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import {
  clearRewards,
  fetchNotifications,
  loadMoreNotifications,
  loadMoreRewards
} from 'redux/actions/NotiActions';
import { changeUserXP } from 'redux/actions/UserActions';
import { connect } from 'react-redux';
import Rankings from './Rankings';
import NotiItem from './NotiItem';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { notiFeedListItem } from '../Styles';
import { rewardValue } from 'constants/defaultValues';

class MainFeeds extends Component {
  static propTypes = {
    changeUserXP: PropTypes.func.isRequired,
    fetchNotifications: PropTypes.func.isRequired,
    loadMore: PropTypes.object.isRequired,
    loadMoreNotifications: PropTypes.func.isRequired,
    loadMoreRewards: PropTypes.func.isRequired,
    numNewNotis: PropTypes.number,
    activeTab: PropTypes.string,
    notifications: PropTypes.array.isRequired,
    rewards: PropTypes.array,
    selectNotiTab: PropTypes.func.isRequired,
    style: PropTypes.object,
    totalRewardAmount: PropTypes.number,
    twinkleXP: PropTypes.number
  };

  state = {
    loading: false,
    originalTotalReward: 0,
    originalTwinkleXP: 0
  };

  render() {
    const {
      loadMore,
      activeTab,
      notifications,
      numNewNotis,
      rewards,
      style,
      totalRewardAmount
    } = this.props;
    const { loading } = this.state;
    const { originalTotalReward, originalTwinkleXP } = this.state;
    return (
      <div style={style}>
        <RoundList style={{ marginTop: '0' }}>
          {numNewNotis > 0 && (
            <Banner
              love
              style={{ marginBottom: '1rem' }}
              onClick={this.onNewNotiAlertClick}
            >
              Tap to See {numNewNotis} New Notification
              {numNewNotis > 1 ? 's' : ''}
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
                <>
                  <p>Tap to collect all your rewards</p>
                  <p>
                    ({totalRewardAmount} Twinkles x {rewardValue.star}{' '}
                    XP/Twinkle ={' '}
                    {addCommasToNumber(totalRewardAmount * rewardValue.star)}{' '}
                    XP)
                  </p>
                </>
              )}
              {totalRewardAmount === 0 && (
                <>
                  <p>{originalTotalReward * rewardValue.star} XP Collected!</p>
                  <p>
                    Your XP went up from {addCommasToNumber(originalTwinkleXP)}{' '}
                    to{' '}
                    {addCommasToNumber(
                      originalTwinkleXP + originalTotalReward * rewardValue.star
                    )}
                  </p>
                </>
              )}
            </Banner>
          )}
          {activeTab === 'notification' &&
            notifications.map(notification => {
              return (
                <li className={notiFeedListItem} key={notification.id}>
                  <NotiItem notification={notification} />
                </li>
              );
            })}
          {activeTab === 'rankings' && <Rankings />}
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
                      user={{ id: rewarderId, username: rewarderUsername }}
                      color={Color.blue()}
                    />{' '}
                    <span
                      style={{
                        color:
                          rewardAmount > 9
                            ? Color.gold()
                            : rewardAmount > 4
                            ? Color.orange()
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
        {((activeTab === 'notification' && loadMore.notifications) ||
          (activeTab === 'reward' && loadMore.rewards)) && (
          <LoadMoreButton
            loading={loading}
            style={{ marginTop: '1rem' }}
            info
            filled
            stretch
            onClick={this.onLoadMore}
          />
        )}
      </div>
    );
  }

  onCollectReward = async() => {
    const {
      changeUserXP,
      clearRewards,
      totalRewardAmount,
      twinkleXP
    } = this.props;
    this.setState({
      originalTotalReward: totalRewardAmount,
      originalTwinkleXP: twinkleXP
    });
    await changeUserXP({
      action: 'collect'
    });
    clearRewards();
  };

  onNewNotiAlertClick = async() => {
    const { selectNotiTab, fetchNotifications } = this.props;
    await fetchNotifications();
    selectNotiTab();
  };

  onLoadMore = async() => {
    const {
      notifications,
      rewards,
      loadMoreNotifications,
      loadMoreRewards,
      activeTab
    } = this.props;
    this.setState({ loading: true });
    if (activeTab === 'notification') {
      await loadMoreNotifications(notifications[notifications.length - 1].id);
    } else {
      await loadMoreRewards(rewards[rewards.length - 1].id);
    }
    this.setState({ loading: false });
  };
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
)(MainFeeds);
