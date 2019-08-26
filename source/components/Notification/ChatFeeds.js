import React, { useState } from 'react';
import { useInterval } from 'helpers/hooks';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import Button from 'components/Button';
import RoundList from 'components/RoundList';
import Icon from 'components/Icon';
import { timeSince } from 'helpers/timeStampHelpers';
import { loadChat, loadChatChannel } from 'helpers/requestHelpers';
import { connect } from 'react-redux';
import { enterChannelWithId, initChat } from 'redux/actions/ChatActions';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { withRouter } from 'react-router';

ChatFeeds.propTypes = {
  content: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  enterChannelWithId: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  initChat: PropTypes.func.isRequired,
  loaded: PropTypes.bool,
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
  enterChannelWithId,
  history,
  initChat,
  loaded,
  reloadedBy,
  reloaderName,
  reloadTimeStamp,
  style = {},
  timeStamp,
  userId,
  username
}) {
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
          background: #fff;
          &:hover {
            transition: background 0.5s;
            background: ${Color.highlightGray()};
          }
        `}
      >
        <p
          style={{
            fontWeight: 'bold',
            fontSize: '2rem',
            color: Color.darkerGray()
          }}
        >
          {content}
        </p>
        <span style={{ color: Color.darkerGray() }}>{renderDetails()}</span>
        <Button skeuomorphic color="darkerGray" onClick={initChatFromThis}>
          <Icon icon="comments" />
          <span style={{ marginLeft: '1rem' }}>Join Conversation</span>
        </Button>
      </li>
    </RoundList>
  );

  async function initChatFromThis() {
    if (!loaded) {
      const data = await loadChat({ dispatch, channelId: 2 });
      initChat(data);
    } else {
      const data = await loadChatChannel({ channelId: 2, dispatch });
      enterChannelWithId({ data });
    }
    history.push('/talk');
  }

  function renderDetails() {
    const posterString = (
      <>
        Started by <UsernameText user={{ id: userId, username }} />
        {timeStamp ? ` ${timeSincePost}` : ''}
      </>
    );
    const reloaderString = (
      <div style={{ marginTop: '0.5rem' }}>
        Brought back by{' '}
        <UsernameText user={{ id: reloadedBy, username: reloaderName }} />
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
    loaded: state.ChatReducer.loaded
  }),
  dispatch => ({
    dispatch,
    enterChannelWithId: params => dispatch(enterChannelWithId(params)),
    initChat: data => dispatch(initChat(data))
  })
)(withRouter(ChatFeeds));
