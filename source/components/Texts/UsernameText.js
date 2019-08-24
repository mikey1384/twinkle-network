import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DropdownList from 'components/DropdownList';
import { connect } from 'react-redux';
import { initChat, openDirectMessageChannel } from 'redux/actions/ChatActions';
import { loadChat, loadDMChannel } from 'helpers/requestHelpers';
import { Color } from 'constants/css';
import { withRouter } from 'react-router';

UsernameText.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  initChat: PropTypes.func.isRequired,
  loaded: PropTypes.bool,
  style: PropTypes.object,
  openDirectMessageChannel: PropTypes.func.isRequired,
  user: PropTypes.object,
  userId: PropTypes.number,
  username: PropTypes.string
};

function UsernameText({
  className,
  color,
  dispatch,
  history,
  initChat,
  loaded,
  openDirectMessageChannel,
  style = {},
  user = {},
  userId,
  username
}) {
  const [menuShown, setMenuShown] = useState(false);
  return (
    <div
      style={{ display: 'inline', position: 'relative' }}
      onMouseLeave={() => setMenuShown(false)}
    >
      <span
        className={className}
        style={{
          cursor: 'pointer',
          fontWeight: 'bold',
          color: user.username
            ? color || Color.darkerGray()
            : Color.lightGray(),
          ...style
        }}
        onClick={onUsernameClick}
        onMouseEnter={onMouseEnter}
      >
        {user.username || '(Deleted)'}
      </span>
      {menuShown && (
        <DropdownList style={{ width: '100%' }}>
          <li onClick={() => window.open(`/users/${user.username}`)}>
            <a
              href={`/users/${user.username}`}
              style={{ color: Color.darkerGray() }}
              onClick={e => e.preventDefault()}
            >
              Profile
            </a>
          </li>
          {user.id !== userId && (
            <li onClick={onLinkClick}>
              <a style={{ color: Color.darkerGray() }}>Talk</a>
            </li>
          )}
        </DropdownList>
      )}
    </div>
  );

  function onMouseEnter() {
    if (user.username) setMenuShown(true);
  }

  async function onLinkClick() {
    setMenuShown(false);
    if (user.id !== userId) {
      if (!loaded) {
        const initialData = await loadChat();
        initChat(initialData);
      }
      const data = await loadDMChannel({ recepient: user, dispatch });
      openDirectMessageChannel({
        user: { id: userId, username },
        recepient: user,
        channelData: data
      });
      history.push('/talk');
    }
  }

  function onUsernameClick() {
    if (user.username) {
      setMenuShown(!menuShown);
    }
  }
}

export default connect(
  state => ({
    loaded: state.ChatReducer.loaded,
    username: state.UserReducer.username,
    userId: state.UserReducer.userId
  }),
  dispatch => ({
    dispatch,
    initChat: params => dispatch(initChat(params)),
    openDirectMessageChannel: params =>
      dispatch(openDirectMessageChannel(params))
  })
)(withRouter(UsernameText));
