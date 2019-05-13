import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { openDirectMessageChannel } from 'redux/actions/ChatActions';
import DropdownList from 'components/DropdownList';
import { Color } from 'constants/css';

UsernameText.propTypes = {
  chatMode: PropTypes.bool,
  className: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
  openDirectMessageChannel: PropTypes.func.isRequired,
  user: PropTypes.object,
  userId: PropTypes.number,
  username: PropTypes.string
};

function UsernameText({
  chatMode,
  className,
  color,
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

  function onLinkClick() {
    setMenuShown(false);
    if (user.id !== userId) {
      openDirectMessageChannel({
        user: { id: userId, username },
        partner: { id: user.id, username: user.username },
        chatCurrentlyOn: chatMode
      });
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
    chatMode: state.ChatReducer.chatMode,
    username: state.UserReducer.username,
    userId: state.UserReducer.userId
  }),
  { openDirectMessageChannel }
)(UsernameText);
