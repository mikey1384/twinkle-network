import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MainFeeds from './MainFeeds';
import ChatFeeds from './ChatFeeds';
import { defaultChatSubject } from 'constants/defaultValues';
import {
  clearNotifications,
  fetchNotifications
} from 'redux/actions/NotiActions';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { container } from './Styles';
import FilterBar from 'components/FilterBar';
import { socket } from 'constants/io';
import { css } from 'emotion';

Notification.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  className: PropTypes.string,
  clearNotifications: PropTypes.func.isRequired,
  currentChatSubject: PropTypes.object,
  fetchNotifications: PropTypes.func.isRequired,
  loadMore: PropTypes.object,
  location: PropTypes.string,
  myId: PropTypes.number,
  numNewNotis: PropTypes.number,
  notifications: PropTypes.array,
  profileTheme: PropTypes.string,
  rewards: PropTypes.array,
  rank: PropTypes.number,
  style: PropTypes.object,
  totalRewardAmount: PropTypes.number,
  twinkleXP: PropTypes.number
};

function Notification({
  children,
  className,
  clearNotifications,
  currentChatSubject: { content = defaultChatSubject, loaded, ...subject },
  fetchNotifications,
  loadMore,
  location,
  myId,
  numNewNotis,
  notifications,
  profileTheme,
  rewards,
  rank,
  style,
  totalRewardAmount,
  twinkleXP
}) {
  const [activeTab, setActiveTab] = useState('rankings');
  const [rewardTabShown, setRewardTabShown] = useState(false);
  const themeColor = profileTheme || 'logoBlue';
  useEffect(() => {
    if (myId) {
      fetchNotifications();
    } else {
      clearNotifications();
      fetchNotifications();
    }
  }, [myId]);

  useEffect(() => {
    if (!myId) {
      setActiveTab('rankings');
    } else {
      const tab =
        activeTab === 'reward' || rewards.length > 0
          ? 'reward'
          : activeTab === 'notification' ||
            (location === 'home' && notifications.length > 0) ||
            numNewNotis > 0
          ? 'notification'
          : 'rankings';
      setActiveTab(tab);
    }
    setRewardTabShown(rewards.length > 0);
  }, [myId, notifications]);

  useEffect(() => {
    socket.on('new_reward', fetchNotifications);
    return function cleanUp() {
      socket.removeListener('new_reward', fetchNotifications);
    };
  });

  return (
    <ErrorBoundary>
      <div style={style} className={`${container} ${className}`}>
        <section>
          <div
            className={css`
              display: flex;
              flex-direction: column;
              align-items: center;
            `}
          >
            {children && children}
          </div>
          {loaded && location === 'home' && (
            <ChatFeeds
              content={content}
              style={{
                marginTop: children ? '1rem' : '0',
                marginBottom: '1rem'
              }}
              {...subject}
            />
          )}
          {notifications.length > 0 && (
            <FilterBar
              color={themeColor}
              bordered
              style={{
                marginTop:
                  (location === 'home' || location === 'videos') && '1rem',
                fontSize: '1.6rem',
                height: '5rem'
              }}
            >
              <nav
                className={`${activeTab === 'notification' &&
                  'active'} ${numNewNotis > 0 && 'alert'}`}
                onClick={() => setActiveTab('notification')}
              >
                News
              </nav>
              <nav
                className={activeTab === 'rankings' ? 'active' : undefined}
                onClick={() => setActiveTab('rankings')}
              >
                Rankings
              </nav>
              {rewardTabShown && (
                <nav
                  className={`${activeTab === 'reward' &&
                    'active'} ${totalRewardAmount > 0 && 'alert'}`}
                  onClick={() => setActiveTab('reward')}
                >
                  Rewards
                </nav>
              )}
            </FilterBar>
          )}
          <MainFeeds
            loadMore={loadMore}
            activeTab={activeTab}
            notifications={notifications}
            rewards={rewards}
            selectNotiTab={() => setActiveTab('notification')}
            style={{
              marginTop: loaded && myId && notifications.length > 0 && '1rem'
            }}
          />
        </section>
      </div>
    </ErrorBoundary>
  );
}

export default connect(
  state => ({
    chatMode: state.ChatReducer.chatMode,
    myId: state.UserReducer.userId,
    loadMore: state.NotiReducer.loadMore,
    notifications: state.NotiReducer.notifications,
    numNewNotis: state.NotiReducer.numNewNotis,
    profileTheme: state.UserReducer.profileTheme,
    rank: state.UserReducer.rank,
    rewards: state.NotiReducer.rewards,
    totalRewardAmount: state.NotiReducer.totalRewardAmount,
    twinkleXP: state.UserReducer.twinkleXP,
    currentChatSubject: state.NotiReducer.currentChatSubject
  }),
  { clearNotifications, fetchNotifications }
)(Notification);
