import React from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import { css } from 'emotion';

Channels.propTypes = {
  userId: PropTypes.number.isRequired,
  currentChannel: PropTypes.object.isRequired,
  channels: PropTypes.arrayOf(
    PropTypes.shape({
      lastMessage: PropTypes.shape({
        sender: PropTypes.shape({
          id: PropTypes.number,
          username: PropTypes.string
        }),
        content: PropTypes.string
      }),
      id: PropTypes.number.isRequired,
      channelName: PropTypes.string,
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
      const { lastMessage, id, channelName, members, numUnreads } = channel;
      const otherMember = members?.filter(member => member.id !== userId)?.[0];
      return (
        <div
          className={css`
            &:hover {
              background: ${Color.checkboxAreaGray()};
            }
          `}
          style={{
            width: '100%',
            backgroundColor: id === selectedChannelId && Color.highlightGray(),
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
                    color: !channelName && !otherMember && '#7c7c7c',
                    fontWeight: 'bold',
                    margin: 0,
                    padding: 0,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    lineHeight: 'normal'
                  }}
                >
                  {channelName || otherMember?.username || '(Deleted)'}
                </p>
              </div>
              <div
                style={{
                  width: '100%',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}
              >
                {renderPreviewMessage(lastMessage)}
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

  function renderPreviewMessage({ content, gameWinnerId, sender }) {
    if (gameWinnerId) {
      return gameWinnerId === userId ? (
        <span>You won the chess match!</span>
      ) : (
        <span>You lost the chess match</span>
      );
    }
    if (sender && content) {
      return (
        <>
          <span>{`${sender.id === userId ? 'You' : sender.username}:`}</span>{' '}
          <span>{content.substring(0, 100)}</span>
        </>
      );
    }
    return '\u00a0';
  }
}
