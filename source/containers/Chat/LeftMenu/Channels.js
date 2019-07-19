import React from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import { css } from 'emotion';

Channels.propTypes = {
  userId: PropTypes.number.isRequired,
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
      numUnreads: PropTypes.number
    })
  ).isRequired,
  onChannelEnter: PropTypes.func.isRequired,
  selectedChannelId: PropTypes.number.isRequired
};

export default function Channels({
  userId,
  channels,
  onChannelEnter,
  selectedChannelId
}) {
  return channels
    .filter(channel => !channel.isHidden)
    .map(
      ({
        lastMessage,
        id,
        channelName,
        members,
        numUnreads = 0,
        twoPeople
      }) => {
        const otherMember = twoPeople
          ? members?.filter(member => Number(member.id) !== userId)?.[0]
          : null;
        return (
          <div
            key={id}
            className={css`
              &:hover {
                background: ${Color.checkboxAreaGray()};
              }
            `}
            style={{
              width: '100%',
              backgroundColor:
                id === selectedChannelId && Color.highlightGray(),
              cursor: 'pointer',
              padding: '1rem',
              height: '6.5rem'
            }}
            onClick={() => onChannelEnter(id)}
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
                    {otherMember?.username || channelName || '(Deleted)'}
                  </p>
                </div>
                <div
                  style={{
                    width: '100%',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}
                >
                  {renderPreviewMessage(lastMessage || {})}
                </div>
              </div>
              {id !== selectedChannelId && numUnreads > 0 && (
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
      }
    );

  function renderPreviewMessage({ content, fileName, gameWinnerId, sender }) {
    const messageSender = sender
      ? sender.id === userId
        ? 'You'
        : sender.username
      : '';
    if (fileName) {
      return (
        <span>
          {`${messageSender}:`} {`"${fileName}"`}
        </span>
      );
    }
    if (typeof gameWinnerId === 'number') {
      if (gameWinnerId === 0) {
        return <span>The chess match ended in a draw</span>;
      }
      return gameWinnerId === userId ? (
        <span>You won the chess match!</span>
      ) : (
        <span>You lost the chess match</span>
      );
    }
    if (messageSender && content) {
      return (
        <>
          <span>{`${messageSender}:`}</span>{' '}
          <span>{content.substring(0, 100)}</span>
        </>
      );
    }
    return '\u00a0';
  }
}
