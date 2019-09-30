import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import MainFeeds from './MainFeeds';
import ChatFeeds from './ChatFeeds';
import { defaultChatSubject } from 'constants/defaultValues';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { container } from './Styles';
import FilterBar from 'components/FilterBar';
import { socket } from 'constants/io';
import { css } from 'emotion';
import { useAppContext } from 'contexts';

Notification.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  className: PropTypes.string,
  location: PropTypes.string,
  style: PropTypes.object
};

export default function Notification({ children, className, location, style }) {
  const {
    notification: {
      state: {
        loadMore,
        notifications,
        numNewNotis,
        rewards,
        totalRewardAmount,
        currentChatSubject: { content = defaultChatSubject, loaded, ...subject }
      },
      actions: { onClearNotifications, onFetchNotifications }
    },
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
      onClearNotifications();
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
