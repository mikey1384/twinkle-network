import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import { css } from 'emotion';

export default class Channels extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    currentChannel: PropTypes.object.isRequired,
    channels: PropTypes.array.isRequired,
    onChannelEnter: PropTypes.func.isRequired,
    selectedChannelId: PropTypes.number.isRequired
  };
  render() {
    const {
      userId,
      currentChannel,
      channels,
      onChannelEnter,
      selectedChannelId
    } = this.props;
    return channels.filter(channel => !channel.isHidden).map(channel => {
      const {
        lastMessageSender,
        lastMessage,
        id,
        channelName,
        numUnreads
      } = channel;
      return (
        <div
          className={css`
            &:hover {
              background: ${Color.wellGray()};
            }
          `}
          style={{
            width: '100%',
            backgroundColor: id === selectedChannelId && Color.channelGray(),
            cursor: 'pointer',
            padding: '1rem',
            height: '6.5rem'
          }}
          onClick={() => onChannelEnter(id)}
          key={id}
        >
          <div
            style={{
              display: 'flex',
              height: '100%',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                display: 'flex',
                width: '85%',
                height: '100%',
                whiteSpace: 'nowrap',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h4
                  style={{
                    color: !channelName && '#7c7c7c',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    lineHeight: 'normal'
                  }}
                >
                  {channelName || '(Deleted)'}
                </h4>
              </div>
              <div
                style={{
                  width: '100%',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}
              >
                {lastMessageSender && lastMessage
                  ? `${
                      lastMessageSender.id === userId
                        ? 'You'
                        : lastMessageSender.username
                    }: ${lastMessage}`
                  : '\u00a0'}
              </div>
            </div>
            {id !== currentChannel.id &&
              numUnreads > 0 && (
                <div
                  style={{
                    background: Color.pink(),
                    display: 'flex',
                    color: '#fff',
                    fontWeight: 'bold',
                    minWidth: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {numUnreads}
                </div>
              )}
          </div>
        </div>
      );
    });
  }
}
