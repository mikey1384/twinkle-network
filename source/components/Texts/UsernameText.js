import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DropdownList from 'components/DropdownList';
import { Color } from 'constants/css';
import { useHistory } from 'react-router-dom';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useChatContext } from 'contexts';

UsernameText.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
  truncate: PropTypes.bool,
  user: PropTypes.object
};

export default function UsernameText({
  className,
  color,
  style = {},
  user = {},
  truncate = false
}) {
  const history = useHistory();
  const {
    requestHelpers: { loadChat, loadDMChannel }
  } = useAppContext();
  const { userId, username } = useMyState();
  const {
    state: { loaded },
    actions: { onInitChat, onOpenDirectMessageChannel }
  } = useChatContext();
  const [menuShown, setMenuShown] = useState(false);
  return (
    <div
      style={{
        display: 'inline',
        position: 'relative',
        width: '100%',
        ...style
      }}
      onMouseLeave={() => setMenuShown(false)}
    >
      <div
        style={{
          display: truncate ? 'block' : 'inline',
          overflowX: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%'
        }}
      >
        <span
          className={className}
          style={{
            width: '100%',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: user.username
              ? color || Color.darkerGray()
              : Color.lighterGray()
          }}
          onClick={onUsernameClick}
          onMouseEnter={onMouseEnter}
        >
          {user.username || '(Deleted)'}
        </span>
      </div>
      {menuShown && (
        <DropdownList style={{ width: '100%' }}>
          <li onClick={() => history.push(`/users/${user.username}`)}>
            <a
              style={{ color: Color.darkerGray(), cursor: 'pointer' }}
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
        onInitChat(initialData);
      }
      const data = await loadDMChannel({ recepient: user });
      onOpenDirectMessageChannel({
        user: { id: userId, username },
        recepient: user,
        channelData: data
      });
      history.push('/chat');
    }
  }

  function onUsernameClick() {
    if (user.username) {
      setMenuShown(!menuShown);
    }
  }
}
