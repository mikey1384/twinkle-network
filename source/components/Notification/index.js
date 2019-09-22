import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MainFeeds from './MainFeeds';
import ChatFeeds from './ChatFeeds';
import { defaultChatSubject } from 'constants/defaultValues';
import {
  clearNotifications,
  onFetchNotifications
} from 'redux/actions/NotiActions';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { container } from './Styles';
import FilterBar from 'components/FilterBar';
import { socket } from 'constants/io';
import { css } from 'emotion';
import { useAppContext } from 'context';

Notification.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  className: PropTypes.string,
  clearNotifications: PropTypes.func.isRequired,
  currentChatSubject: PropTypes.object,
  onFetchNotifications: PropTypes.func.isRequired,
  loadMore: PropTypes.object,
  location: PropTypes.string,
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
  onFetchNotifications,
  loadMore,
  location,
  numNewNotis,
  notifications,
  rewards,
  style,
  totalRewardAmount
}) {
  const {
    user: {
      state: { userId }
    },
    requestHelpers: { fetchNotifications }
  } = useAppContext();
  const [activeTab, setActiveTab] = useState('rankings');
  const [rewardTabShown, setRewardTabShown] = useState(false);
  const userChangedTab = useRef(false);
  useEffect(() => {
    userChangedTab.current = false;
    if (userId) {
      handleFetchNotifications();
    } else {
      clearNotifications();
      handleFetchNotifications();
    }
  }, [userId]);

  useEffect(() => {
    if (!userChangedTab.current) {
      if (!userId) {
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
  }, [userId, notifications]);

  useEffect(() => {
    socket.on('new_reward', handleFetchNotifications);
    return function cleanUp() {
      socket.removeListener('new_reward', handleFetchNotifications);
    };
  });

  return (
    <ErrorBoundary>
      <div style={style} className={`${container} ${className}`}>
        <section style={{ marginBottom: '0.5rem' }}>
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
            selectNotiTab={() => {
              userChangedTab.current = true;
              setActiveTab('notification');
            }}
            style={{
              marginTop: loaded && userId && notifications.length > 0 && '1rem'
            }}
          />
        </section>
      </div>
    </ErrorBoundary>
  );

  async function handleFetchNotifications() {
    const data = await fetchNotifications();
    onFetchNotifications(data);
  }
}

export default connect(
  state => ({
    loadMore: state.NotiReducer.loadMore,
    notifications: state.NotiReducer.notifications,
    numNewNotis: state.NotiReducer.numNewNotis,
    rewards: state.NotiReducer.rewards,
    totalRewardAmount: state.NotiReducer.totalRewardAmount,
    currentChatSubject: state.NotiReducer.currentChatSubject
  }),
  { clearNotifications, onFetchNotifications }
)(Notification);
