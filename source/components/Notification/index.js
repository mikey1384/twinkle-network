import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import MainFeeds from './MainFeeds';
import ChatFeeds from './ChatFeeds';
import { defaultChatSubject } from 'constants/defaultValues';
import {
  clearNotifications,
  fetchNotifications
} from 'redux/actions/NotiActions';
import ExecutionEnvironment from 'exenv';
import { container } from './Styles';
import FilterBar from 'components/FilterBar';
import { borderRadius, Color } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { socket } from 'constants/io';
import { css } from 'emotion';

class Notification extends Component {
  static propTypes = {
    chatMode: PropTypes.bool.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    clearNotifications: PropTypes.func.isRequired,
    currentChatSubject: PropTypes.object,
    fetchNotifications: PropTypes.func.isRequired,
    loadMore: PropTypes.object,
    myId: PropTypes.number,
    notifications: PropTypes.array.isRequired,
    numNewNotis: PropTypes.number,
    rank: PropTypes.number,
    rewards: PropTypes.array.isRequired,
    style: PropTypes.object,
    totalRewardAmount: PropTypes.number,
    position: PropTypes.string,
    twinkleXP: PropTypes.number
  };

  mounted = false;

  constructor({ rewards }) {
    super();
    this.state = {
      activeTab: 'leaderboard',
      rewardTabShown: false
    };
  }

  async componentDidMount() {
    const { fetchNotifications } = this.props;
    this.mounted = true;
    addEvent(window, 'mousemove', this.onMouseMove);
    socket.on('new_reward', this.notifyNewReward);
    await fetchNotifications();
    if (this.mounted) {
      this.setState({
        activeTab:
          this.props.rewards.length > 0
            ? 'reward'
            : this.props.notifications.length > 0
              ? 'notification'
              : 'leaderboard',
        rewardTabShown: this.props.rewards.length > 0
      });
    }
  }

  async componentDidUpdate(prevProps) {
    const { clearNotifications, fetchNotifications } = this.props;
    if (prevProps.myId !== this.props.myId) {
      if (!this.props.myId) {
        this.setState({ activeTab: 'leaderboard' });
        clearNotifications();
      } else {
        await fetchNotifications();
        this.setState({
          activeTab:
            this.props.rewards.length > 0
              ? 'reward'
              : this.props.notifications.length > 0
                ? 'notification'
                : 'leaderboard',
          rewardTabShown: this.props.rewards.length > 0
        });
      }
    }
  }

  componentWillUnmount() {
    if (ExecutionEnvironment.canUseDOM) {
      removeEvent(window, 'mousemove', this.onMouseMove);
    }
    socket.removeListener('new_reward', this.notifyNewReward);
    this.mounted = false;
  }

  render() {
    const {
      notifications,
      myId,
      className,
      currentChatSubject: { content = defaultChatSubject, loaded, ...subject },
      children,
      loadMore,
      numNewNotis,
      rank,
      rewards,
      style,
      totalRewardAmount,
      twinkleXP
    } = this.props;
    const rankedColor =
      rank === 1 ? Color.gold() : rank !== 0 && rank <= 3 ? '#fff' : undefined;
    const { activeTab, rewardTabShown } = this.state;
    return (
      <div
        style={style}
        className={`${container} ${className}`}
        onScroll={this.handleScroll}
      >
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
                fontSize: '1.6rem'
              }}
            >
              <nav
                className={`${activeTab === 'notification' &&
                  'active'} ${numNewNotis > 0 && 'alert'}`}
                onClick={() => this.setState({ activeTab: 'notification' })}
              >
                Notifications
              </nav>
              <nav
                className={activeTab === 'leaderboard' ? 'active' : undefined}
                onClick={() => this.setState({ activeTab: 'leaderboard' })}
              >
                Leaderboard
              </nav>
              {rewardTabShown && (
                <nav
                  className={`${activeTab === 'reward' &&
                    'active'} ${totalRewardAmount > 0 && 'alert'}`}
                  onClick={() => this.setState({ activeTab: 'reward' })}
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
            selectNotiTab={() => this.setState({ activeTab: 'notification' })}
            myId={myId}
            style={{ marginTop: loaded && '1rem' }}
          />
        </section>
      </div>
    );
  }

  notifyNewReward = async() => {
    const { fetchNotifications } = this.props;
    await fetchNotifications();
    this.setState({
      rewardTabShown: true,
      activeTab: 'reward'
    });
  };
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
