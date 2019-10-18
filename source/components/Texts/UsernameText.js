import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import DropdownList from 'components/DropdownList';
import { Color } from 'constants/css';
import { withRouter } from 'react-router';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useChatContext } from 'contexts';

UsernameText.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  history: PropTypes.object.isRequired,
  style: PropTypes.object,
  user: PropTypes.object
};

function UsernameText({ className, color, history, style = {}, user = {} }) {
  const {
    requestHelpers: { loadChat, loadDMChannel }
  } = useAppContext();
  const { userId, username } = useMyState();
  const {
    state: { loaded },
    actions: { onInitChat, onOpenDirectMessageChannel }
  } = useChatContext();
  const [menuShown, setMenuShown] = useState(false);
  return useMemo(
    () => (
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
              : Color.lighterGray(),
            ...style
          }}
          onClick={onUsernameClick}
          onMouseEnter={onMouseEnter}
        >
          {user.username || '(Deleted)'}
        </span>
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
    ),
    [loaded, menuShown, user, userId, username]
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

export default withRouter(UsernameText);
