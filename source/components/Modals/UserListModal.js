import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'components/Modal';
import Button from 'components/Button';
import RoundList from 'components/RoundList';
import Icon from 'components/Icon';
import { initChat, openDirectMessageChannel } from 'redux/actions/ChatActions';
import { connect } from 'react-redux';
import { Color } from 'constants/css';
import { withRouter } from 'react-router';
import { useAppContext } from 'context';

UserListModal.propTypes = {
  description: PropTypes.string,
  descriptionShown: PropTypes.func,
  descriptionColor: PropTypes.string,
  history: PropTypes.object.isRequired,
  initChat: PropTypes.func.isRequired,
  loaded: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
  openDirectMessageChannel: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number.isRequired }))
    .isRequired
};

function UserListModal({
  description = '',
  descriptionColor = Color.green(),
  descriptionShown,
  history,
  initChat,
  loaded,
  onHide,
  openDirectMessageChannel,
  title,
  users
}) {
  const {
    user: {
      state: { userId, username }
    },
    requestHelpers: { loadChat, loadDMChannel }
  } = useAppContext();
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
        initChat(initialData);
      }
      const data = await loadDMChannel({ recepient: user });
      openDirectMessageChannel({
        user: { id: userId, username },
        recepient: user,
        channelData: data
      });
      history.push('/talk');
    }
  }
}

export default connect(
  state => ({
    loaded: state.ChatReducer.loaded
  }),
  { initChat, openDirectMessageChannel }
)(withRouter(UserListModal));
