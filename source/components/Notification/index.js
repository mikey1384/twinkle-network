import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import MainFeeds from './MainFeeds';
import ChatFeeds from './ChatFeeds';
import { defaultChatSubject } from 'constants/defaultValues';
import ErrorBoundary from 'components/ErrorBoundary';
import { container } from './Styles';
import FilterBar from 'components/FilterBar';
import { socket } from 'constants/io';
import { css } from 'emotion';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useNotiContext } from 'contexts';

Notification.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  className: PropTypes.string,
  location: PropTypes.string,
  style: PropTypes.object
};

function Notification({ children, className, location, style }) {
  const {
    requestHelpers: { loadRankings, fetchNotifications }
  } = useAppContext();
  const { userId, twinkleXP } = useMyState();
  const {
    state: {
      loadMore,
      notifications,
      numNewNotis,
      rewards,
      totalRewardAmount,
      currentChatSubject: { content = defaultChatSubject, loaded, ...subject }
    },
    actions: { onFetchNotifications, onGetRanks, onClearNotifications }
  } = useNotiContext();
  const [activeTab, setActiveTab] = useState('rankings');
  const [rewardTabShown, setRewardTabShown] = useState(false);
  const userChangedTab = useRef(false);
  const mounted = useRef(true);
  const prevUserId = useRef(userId);
  const prevTwinkleXP = useRef(twinkleXP);
  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    userChangedTab.current = false;
    handleFetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, notifications]);

  useEffect(() => {
    if (userId !== prevUserId.current) {
      onClearNotifications();
    }
    prevUserId.current = userId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (
      typeof twinkleXP === 'number' &&
      twinkleXP > (prevTwinkleXP.current || 0)
    ) {
      fetchRankings();
    }
    prevTwinkleXP.current = twinkleXP;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twinkleXP]);

  useEffect(() => {
    socket.on('new_reward_received', handleFetchNotifications);
    return function cleanUp() {
      socket.removeListener('new_reward_received', handleFetchNotifications);
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
              myId={userId}
              content={content}
              style={{
                marginTop: children ? '1rem' : '0',
                marginBottom: '1rem'
              }}
              {...subject}
            />
          )}
          {notifications.length > 0 && userId && (
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

  function handleFetchNotifications() {
    fetchNews();
    fetchRankings();
  }
  async function fetchNews() {
    const data = await fetchNotifications();
    if (mounted.current) {
      onFetchNotifications(data);
    }
  }
  async function fetchRankings() {
    const { all, top30s } = await loadRankings();
    if (mounted.current) {
      onGetRanks({ all, top30s });
    }
  }
}

export default memo(Notification);
