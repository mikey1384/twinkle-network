import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import ChatSearchBox from './ChatSearchBox';
import Channels from './Channels';
import FullTextReveal from 'components/FullTextReveal';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import { textIsOverflown } from 'helpers';
import { queryStringForArray } from 'helpers/stringHelpers';
import { mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

const channelName = (channels, currentChannel) => {
  for (let i = 0; i < channels.length; i++) {
    if (channels[i].id === currentChannel.id) {
      return channels[i].channelName;
    }
  }
  return null;
};

export default class LeftMenu extends Component {
  static propTypes = {
    channels: PropTypes.array.isRequired,
    channelLoadMoreButtonShown: PropTypes.bool.isRequired,
    currentChannel: PropTypes.object.isRequired,
    currentChannelOnlineMembers: PropTypes.array.isRequired,
    loadMoreChannels: PropTypes.func.isRequired,
    onChannelEnter: PropTypes.func.isRequired,
    onNewButtonClick: PropTypes.func.isRequired,
    selectedChannelId: PropTypes.number.isRequired,
    showUserListModal: PropTypes.func.isRequired,
    userId: PropTypes.number.isRequired
  };

  state = {
    channelsLoading: false,
    onTitleHover: false
  };

  componentDidMount() {
    addEvent(this.channelList, 'scroll', this.onListScroll);
  }

  componentDidUpdate(prevProps) {
    const { currentChannel, channels } = this.props;
    if (
      prevProps.channels[0] !== channels[0] &&
      currentChannel.id === channels[0].id
    ) {
      this.channelList.scrollTop = 0;
    }
  }

  componentWillUnmount() {
    removeEvent(this.channelList, 'scroll', this.onScroll);
  }

  render() {
    const {
      channels,
      channelLoadMoreButtonShown,
      currentChannel,
      onChannelEnter,
      onNewButtonClick,
      selectedChannelId,
      showUserListModal,
      userId
    } = this.props;
    const { channelsLoading, onTitleHover } = this.state;
    return (
      <div
        className={css`
          display: flex;
          flex-direction: column;
          height: CALC(100vh - 6rem);
          width: 30rem;
          position: relative;
          background: #fff;
          -webkit-overflow-scrolling: touch;
          @media (max-width: ${mobileMaxWidth}) {
            width: 25%;
            height: CALC(100vh - 9rem);
          }
        `}
      >
        <div
          className={css`
            width: 100%;
            padding: 1rem;
            display: flex;
            justify-content: space-between;
          `}
        >
          <div
            className={css`
              grid-area: channelDetail;
              display: flex;
              width: CALC(100% - 6rem);
              flex-direction: column;
            `}
          >
            <span
              ref={ref => {
                this.channelTitle = ref;
              }}
              style={{
                gridArea: 'channelName',
                textAlign: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                display: 'block',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                lineHeight: 'normal',
                cursor: 'default',
                color: !channelName(channels, currentChannel) && '#7c7c7c'
              }}
              onClick={() =>
                this.setState(state => ({
                  onTitleHover: textIsOverflown(this.channelTitle)
                    ? !state.onTitleHover
                    : false
                }))
              }
              onMouseOver={this.onMouseOverTitle}
              onMouseLeave={() => this.setState({ onTitleHover: false })}
            >
              {channelName(channels, currentChannel)
                ? channelName(channels, currentChannel)
                : '(Deleted)'}
            </span>
            <FullTextReveal
              text={channelName(channels, currentChannel) || ''}
              show={onTitleHover}
            />
            {currentChannel.id !== 0 ? (
              <small
                style={{ gridArea: 'channelMembers', textAlign: 'center' }}
              >
                <a
                  style={{
                    cursor: 'pointer'
                  }}
                  onClick={showUserListModal}
                >
                  {this.renderNumberOfMembers()}
                </a>{' '}
                online
              </small>
            ) : (
              <small>{'\u00a0'}</small>
            )}
          </div>
          <Button transparent onClick={onNewButtonClick}>
            +New
          </Button>
        </div>
        <ChatSearchBox />
        <div
          style={{
            overflow: 'scroll',
            position: 'absolute',
            top: '11.5rem',
            left: 0,
            right: 0,
            bottom: 0
          }}
          ref={ref => (this.channelList = ref)}
        >
          <Channels
            userId={userId}
            currentChannel={currentChannel}
            channels={channels}
            selectedChannelId={selectedChannelId}
            onChannelEnter={onChannelEnter}
          />
          {channelLoadMoreButtonShown && (
            <LoadMoreButton
              success
              filled
              loading={channelsLoading}
              onClick={this.loadMoreChannels}
              style={{
                width: '100%',
                borderRadius: 0,
                border: 0
              }}
            />
          )}
        </div>
      </div>
    );
  }

  loadMoreChannels = async() => {
    const { currentChannel, channels, loadMoreChannels } = this.props;
    const { channelsLoading } = this.state;
    if (!channelsLoading) {
      this.setState({ channelsLoading: true });
      await loadMoreChannels(
        currentChannel.id,
        queryStringForArray({
          array: channels,
          originVar: 'id',
          destinationVar: 'channelIds'
        })
      );
      this.setState({ channelsLoading: false });
    }
  };

  onListScroll = () => {
    if (
      this.channelList.scrollTop >=
      (this.channelList.scrollHeight - this.channelList.offsetHeight) * 0.7
    ) {
      this.loadMoreChannels();
    }
  };

  onMouseOverTitle = () => {
    if (textIsOverflown(this.channelTitle)) {
      this.setState({ onTitleHover: true });
    }
  };

  renderNumberOfMembers = () => {
    const { currentChannel, currentChannelOnlineMembers } = this.props;
    const numberOfMembers = currentChannel.members.length;
    return `${currentChannelOnlineMembers.length || 1}${
      numberOfMembers <= 1 ? '' : '/' + numberOfMembers
    }`;
  };
}
