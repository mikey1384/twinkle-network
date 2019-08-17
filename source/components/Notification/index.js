import React, { useEffect, useRef, useState } from 'react';
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
  rewards: PropTypes.array,
  style: PropTypes.object,
  totalRewardAmount: PropTypes.number
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
  rewards,
  style,
  totalRewardAmount
}) {
  const [activeTab, setActiveTab] = useState('rankings');
  const [rewardTabShown, setRewardTabShown] = useState(false);
  const userChangedTab = useRef(false);
  useEffect(() => {
    userChangedTab.current = false;
    if (myId) {
      fetchNotifications();
    } else {
      clearNotifications();
      fetchNotifications();
    }
  }, [myId]);

  useEffect(() => {
    if (!userChangedTab.current) {
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
        <section style={{ marginBottom: '1rem' }}>
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
              bordered
              style={{
                fontSize: '1.6rem',
                height: '5rem'
              }}
            >
              <nav
                className={`${activeTab === 'notification' &&
                  'active'} ${numNewNotis > 0 && 'alert'}`}
                onClick={() => {
                  userChangedTab.current = true;
                  setActiveTab('notification');
                }}
              >
                News
              </nav>
              <nav
                className={activeTab === 'rankings' ? 'active' : undefined}
                onClick={() => {
                  userChangedTab.current = true;
                  setActiveTab('rankings');
                }}
              >
                Rankings
              </nav>
              {rewardTabShown && (
                <nav
                  className={`${activeTab === 'reward' &&
                    'active'} ${totalRewardAmount > 0 && 'alert'}`}
                  onClick={() => {
                    userChangedTab.current = true;
                    setActiveTab('reward');
                  }}
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
    myId: state.UserReducer.userId,
    loadMore: state.NotiReducer.loadMore,
    notifications: state.NotiReducer.notifications,
    numNewNotis: state.NotiReducer.numNewNotis,
    rewards: state.NotiReducer.rewards,
    totalRewardAmount: state.NotiReducer.totalRewardAmount,
    currentChatSubject: state.NotiReducer.currentChatSubject
  }),
  { clearNotifications, fetchNotifications }
)(Notification);
