import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Color, desktopMinWidth } from 'constants/css';
import { css } from 'emotion';
import { useMyState } from 'helpers/hooks';

Channel.propTypes = {
  chatType: PropTypes.string,
  channel: PropTypes.object.isRequired,
  customChannelNames: PropTypes.object.isRequired,
  onChannelEnter: PropTypes.func.isRequired,
  selectedChannelId: PropTypes.number
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
  selectedChannelId
}) {
  const { profileTheme, userId, username } = useMyState();
  const effectiveChannelName = useMemo(
    () => customChannelNames[id] || channelName,
    [channelName, customChannelNames, id]
  );
  const selected = useMemo(() => !chatType && id === selectedChannelId, [
    chatType,
    id,
    selectedChannelId
  ]);
  const PreviewMessage = useMemo(
    () => renderPreviewMessage(lastMessage || {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lastMessage]
  );
  const otherMember = twoPeople
    ? members
        ?.map(({ username }) => username)
        ?.filter(memberUsername => memberUsername !== username)?.[0]
    : undefined;
  const ChannelName = useMemo(
    () => otherMember || effectiveChannelName || '(Deleted)',
    [effectiveChannelName, otherMember]
  );

  if (ChannelName === username) {
    console.log(
      'members: ' +
        Object.entries(members[0]) +
        ' ' +
        Object.entries(members[1] || {}),
      'effective channel name: ' + effectiveChannelName,
      'other member: ' + otherMember,
      'two people: ' + twoPeople
    );
  }

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
          width: '100%',
          display: 'flex',
          height: '100%',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            whiteSpace: 'nowrap',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <p
              style={{
                color:
                  id === 2
                    ? Color[
                        profileTheme === 'black' ? 'darkBlue' : profileTheme
                      ]()
                    : !effectiveChannelName && !otherMember && '#7c7c7c',
                fontWeight: 'bold',
                margin: 0,
                padding: 0,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                lineHeight: 'normal'
              }}
            >
              {ChannelName}
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
                alignItems: 'center',
                position: 'relative',
                right: '1.5rem',
                bottom: '1.2rem'
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
