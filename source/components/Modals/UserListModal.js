import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'components/Modal';
import Button from 'components/Button';
import RoundList from 'components/RoundList';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { withRouter } from 'react-router';
import { useAppContext, useChatContext } from 'contexts';

UserListModal.propTypes = {
  description: PropTypes.string,
  descriptionShown: PropTypes.func,
  descriptionColor: PropTypes.string,
  history: PropTypes.object.isRequired,
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number.isRequired }))
    .isRequired
};

function UserListModal({
  description = '',
  descriptionColor = Color.green(),
  descriptionShown,
  history,
  onHide,
  title,
  users
}) {
  const {
    user: {
      state: { userId, username }
    },
    requestHelpers: { loadChat, loadDMChannel }
  } = useAppContext();
  const {
    state: { loaded },
    actions: { onInitChat, onOpenDirectMessageChannel }
  } = useChatContext();
  const otherUsers = users.filter(user => user.id !== userId);
  let userArray = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === userId) userArray.push(users[i]);
  }

  return (
    <Modal small onHide={onHide}>
      <header>{title}</header>
      <main>
        <RoundList>
          {userArray.concat(otherUsers).map(user => {
            let userStatusDisplayed =
              typeof descriptionShown === 'function'
                ? descriptionShown(user)
                : user.id === userId;
            return (
              <li
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
                      onClick={() => onTalkClick(user)}
                    >
                      <Icon icon="comments" />
                      &nbsp;&nbsp;Talk
                    </Button>
                  </div>
                )}
              </li>
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

  async function onTalkClick(user) {
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

export default withRouter(UserListModal);
