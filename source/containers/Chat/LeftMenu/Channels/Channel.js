import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Color, desktopMinWidth } from 'constants/css';
import { css } from 'emotion';

Channel.propTypes = {
  chatType: PropTypes.string.isRequired,
  channel: PropTypes.object.isRequired,
  customChannelNames: PropTypes.object.isRequired,
  onChannelEnter: PropTypes.func.isRequired,
  selectedChannelId: PropTypes.func.isRequired,
  userId: PropTypes.number
};

function Channel({
  chatType,
  customChannelNames,
  channel: {
    lastMessage,
    id,
    channelName,
    members,
    numUnreads = 0,
    twoPeople
  } = {},
  onChannelEnter,
  selectedChannelId,
  userId
}) {
  const effectiveChannelName = customChannelNames[id] || channelName;
  const otherMember = twoPeople
    ? members?.filter(member => Number(member.id) !== userId)?.[0]
    : null;
  const selected = !chatType && id === selectedChannelId;
  const PreviewMessage = useMemo(
    () => renderPreviewMessage(lastMessage || {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lastMessage]
  );

  return (
    <div
      key={id}
      className={css`
        @media (min-width: ${desktopMinWidth}) {
          &:hover {
            background: ${Color.checkboxAreaGray()};
          }
        }
      `}
      style={{
        width: '100%',
        backgroundColor: selected && Color.highlightGray(),
        cursor: 'pointer',
        padding: '1rem',
        height: '6.5rem'
      }}
      onClick={() => {
        if (!selected) {
          onChannelEnter(id);
        }
      }}
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
                color: !effectiveChannelName && !otherMember && '#7c7c7c',
                fontWeight: 'bold',
                margin: 0,
                padding: 0,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                lineHeight: 'normal'
              }}
            >
              {otherMember?.username || effectiveChannelName || '(Deleted)'}
            </p>
          </div>
          <div
            style={{
              width: '100%',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}
          >
            {PreviewMessage}
          </div>
        </div>
        {id !== selectedChannelId &&
          numUnreads > 0 &&
          lastMessage?.sender?.id !== userId && (
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

  function renderPreviewMessage({ content, fileName, gameWinnerId, sender }) {
    const messageSender = sender?.id
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
      const truncatedContent =
        content.startsWith('/spoiler ') || content.startsWith('/secret ')
          ? 'Secret Message'
          : content.substr(0, 100);
      return (
        <>
          <span>{`${messageSender}: `}</span>
          <span>{truncatedContent}</span>
        </>
      );
    }
    return '\u00a0';
  }
}

export default memo(Channel);
