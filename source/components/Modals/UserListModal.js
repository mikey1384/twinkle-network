import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import RoundList from 'components/RoundList';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { useHistory } from 'react-router-dom';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useChatContext } from 'contexts';

UserListModal.propTypes = {
  description: PropTypes.string,
  descriptionShown: PropTypes.func,
  descriptionColor: PropTypes.string,
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number.isRequired }))
    .isRequired
};

export default function UserListModal({
  description = '',
  descriptionColor = Color.green(),
  descriptionShown,
  onHide,
  title,
  users
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
  const allUsers = useMemo(() => {
    const otherUsers = users.filter(user => user.id !== userId);
    let userArray = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === userId) userArray.push(users[i]);
    }
    return userArray.concat(otherUsers);
  }, [userId, users]);

  return (
    <Modal small onHide={onHide}>
      <header>{title}</header>
      <main>
        <RoundList>
          {allUsers.map(user => {
            let userStatusDisplayed =
              typeof descriptionShown === 'function'
                ? descriptionShown(user)
                : user.id === userId;
            return (
              <nav
                key={user.id}
                style={{
                  background: '#fff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  {user.username}{' '}
                  <span
                    style={{
                      color: descriptionColor,
                      fontWeight: 'bold'
                    }}
                  >
                    {userStatusDisplayed && description}
                  </span>
                </div>
                {userId && user.id !== userId && (
                  <div>
                    <Button
                      color="logoBlue"
                      filled
                      style={{ fontSize: '1.3rem' }}
                      onClick={() => handleTalkClick(user)}
                    >
                      <Icon icon="comments" />
                      &nbsp;&nbsp;Talk
                    </Button>
                  </div>
                )}
              </nav>
            );
          })}
        </RoundList>
      </main>
      <footer>
        <Button transparent onClick={onHide}>
          Close
        </Button>
      </footer>
    </Modal>
  );

  async function handleTalkClick(user) {
    if (user.id !== userId) {
      onHide();
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
}
