import React from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import { css } from 'emotion';

Channels.propTypes = {
  userId: PropTypes.number.isRequired,
  currentChannel: PropTypes.object.isRequired,
  channels: PropTypes.arrayOf(
    PropTypes.shape({
      lastMessageSender: PropTypes.shape({
        id: PropTypes.number,
        username: PropTypes.string
      }),
      lastMessage: PropTypes.string,
      id: PropTypes.number.isRequired,
      channelName: PropTypes.string.isRequired,
      numUnreads: PropTypes.number.isRequired
    })
  ).isRequired,
  onChannelEnter: PropTypes.func.isRequired,
  selectedChannelId: PropTypes.number.isRequired
};

export default function Channels({
  userId,
  currentChannel,
  channels,
  onChannelEnter,
  selectedChannelId
}) {
  return channels
    .filter(channel => !channel.isHidden)
    .map(channel => {
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
                <p
                  style={{
                    color: !channelName && '#7c7c7c',
                    fontWeight: 'bold',
                    margin: 0,
                    padding: 0,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    lineHeight: 'normal'
                  }}
                >
                  {channelName || '(Deleted)'}
                </p>
              </div>
              <div
                style={{
                  width: '100%',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}
              >
                {lastMessageSender && lastMessage ? (
                  <>
                    <span>{`${
                      lastMessageSender.id === userId
                        ? 'You'
                        : lastMessageSender.username
                    }:`}</span>{' '}
                    <span>{lastMessage.substring(0, 100)}</span>
                  </>
                ) : (
                  '\u00a0'
                )}
              </div>
            </div>
            {id !== currentChannel.id && numUnreads > 0 && (
              <div
                style={{
                  background: Color.rose(),
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
