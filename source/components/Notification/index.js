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
import { borderRadius, Color } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';
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
  rewards,
  rank,
  style,
  totalRewardAmount,
  twinkleXP
}) {
  const [activeTab, setActiveTab] = useState('rankings');
  const [rewardTabShown, setRewardTabShown] = useState(false);

  useEffect(() => {
    if (myId) {
      fetchNotifications();
    } else {
      clearNotifications();
    }
  }, [myId]);

  useEffect(() => {
    if (!myId) {
      setActiveTab('rankings');
    } else {
      setActiveTab(
        rewards.length > 0
          ? 'reward'
          : (location === 'home' && notifications.length > 0) || numNewNotis > 0
          ? 'notification'
          : 'rankings'
      );
    }
    setRewardTabShown(rewards.length > 0);
  }, [myId, notifications]);

  useEffect(() => {
    socket.on('new_reward', fetchNotifications);
    return () => {
      socket.removeListener('new_reward', fetchNotifications);
    };
  });

  const rankedColor =
    rank === 1 ? Color.gold() : rank !== 0 && rank <= 3 ? '#fff' : undefined;
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
          {loaded && (
            <ChatFeeds
              content={content}
              style={{
                marginTop: children ? '1rem' : '0',
                marginBottom: '1rem'
              }}
              {...subject}
            />
          )}
          <div
            style={{
              marginTop: children ? '1rem' : '0',
              marginBottom: '1rem',
              background: myId
                ? rank > 0 &&
                  (rank < 3
                    ? Color.black()
                    : rank === 3
                    ? Color.orange()
                    : null)
                : Color.logoBlue()
            }}
            className={css`
              width: 100%;
              margin-bottom: 0px;
              text-align: center;
              padding: 1rem;
              background: #fff;
              border: 1px solid #eeeeee;
              border-radius: ${borderRadius};
              p {
                font-weight: bold;
                margin-bottom: 0px;
              }
              a {
                font-size: 1.5rem;
                font-weight: bold;
              }
            `}
          >
            {myId ? (
              <p>
                <span
                  style={{
                    color: rankedColor || Color.logoGreen(),
                    fontSize: '3rem'
                  }}
                >
                  {twinkleXP ? addCommasToNumber(twinkleXP) : 0}
                </span>{' '}
                <span
                  style={{
                    color: rankedColor || Color.gold(),
                    fontSize: '3rem'
                  }}
                >
                  XP
                </span>
                &nbsp;&nbsp;
                <span
                  style={{
                    color:
                      rankedColor ||
                      (rank > 0 && rank <= 10
                        ? Color.pink()
                        : Color.buttonGray()),
                    fontSize: '2rem'
                  }}
                >
                  {rank ? `Rank #${rank}` : 'Unranked'}
                </span>
              </p>
            ) : (
              <p style={{ fontSize: '2.5rem', color: '#fff' }}>Leaderboard</p>
            )}
          </div>
          {notifications.length > 0 && (
            <FilterBar
              bordered
              style={{
                marginTop: '1rem',
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
            style={{ marginTop: loaded && '1rem' }}
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
    rank: state.UserReducer.rank,
    rewards: state.NotiReducer.rewards,
    totalRewardAmount: state.NotiReducer.totalRewardAmount,
    twinkleXP: state.UserReducer.twinkleXP,
    currentChatSubject: state.NotiReducer.currentChatSubject
  }),
  { clearNotifications, fetchNotifications }
)(Notification);
