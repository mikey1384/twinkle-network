import React, { useState } from 'react';
import { useInterval } from 'helpers/hooks';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import Button from 'components/Button';
import RoundList from 'components/RoundList';
import Icon from 'components/Icon';
import { timeSince } from 'helpers/timeStampHelpers';
import { loadChat } from 'helpers/requestHelpers';
import { connect } from 'react-redux';
import { initChat } from 'redux/actions/ChatActions';
import { Color } from 'constants/css';
import { css } from 'emotion';

ChatFeeds.propTypes = {
  content: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  initChat: PropTypes.func.isRequired,
  profileTheme: PropTypes.string,
  reloadedBy: PropTypes.number,
  reloaderName: PropTypes.string,
  reloadTimeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userId: PropTypes.number,
  username: PropTypes.string
};

function ChatFeeds({
  content,
  dispatch,
  initChat,
  profileTheme,
  reloadedBy,
  reloaderName,
  reloadTimeStamp,
  style = {},
  timeStamp,
  userId,
  username
}) {
  const themeColor = profileTheme || 'logoBlue';
  const [timeSincePost, setTimeSincePost] = useState(timeSince(timeStamp));
  const [timeSinceReload, setTimeSinceReload] = useState(
    timeSince(reloadTimeStamp)
  );
  useInterval(
    () => {
      setTimeSincePost(timeSince(timeStamp));
      setTimeSinceReload(timeSince(reloadTimeStamp));
    },
    1000,
    [timeStamp, reloadTimeStamp]
  );

  return (
    <RoundList
      style={{
        textAlign: 'center',
        marginTop: '0',
        ...style
      }}
    >
      <li
        style={{
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
        className={css`
          background: ${Color[themeColor](0.6)};
          &:hover {
            transition: background 0.5s;
            background: ${Color[themeColor]()};
          }
        `}
      >
        <p
          style={{
            fontWeight: 'bold',
            color: '#fff',
            fontSize: '2rem'
          }}
        >
          {content}
        </p>
        <span style={{ color: '#fff' }}>{renderDetails()}</span>
        <Button snow onClick={initChatFromThis}>
          <Icon icon="comments" />
          <span style={{ marginLeft: '1rem' }}>Join Conversation</span>
        </Button>
      </li>
    </RoundList>
  );

  async function initChatFromThis() {
    const data = await loadChat({ dispatch, channelId: 2 });
    initChat(data);
  }

  function renderDetails() {
    const posterString = (
      <>
        Started by <UsernameText color="#fff" user={{ id: userId, username }} />
        {timeStamp ? ` ${timeSincePost}` : ''}
      </>
    );
    const reloaderString = (
      <div style={{ marginTop: '0.5rem' }}>
        Brought back by{' '}
        <UsernameText
          color="#fff"
          user={{ id: reloadedBy, username: reloaderName }}
        />
        {reloadTimeStamp ? ` ${timeSinceReload}` : ''}
      </div>
    );

    return (
      <div style={{ margin: '0.5rem 0 1.5rem 0' }}>
        <div>{userId ? posterString : 'Join the conversation!'}</div>
        {reloadedBy && reloaderString}
      </div>
    );
  }
}

export default connect(
  state => ({
    profileTheme: state.UserReducer.profileTheme
  }),
  dispatch => ({
    dispatch,
    initChat: data => dispatch(initChat(data))
  })
)(ChatFeeds);
