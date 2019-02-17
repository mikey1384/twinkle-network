import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'components/Modal';
import Button from 'components/Button';
import RoundList from 'components/RoundList';
import Icon from 'components/Icon';
import { openDirectMessageChannel } from 'redux/actions/ChatActions';
import { connect } from 'react-redux';
import { Color } from 'constants/css';

UserListModal.propTypes = {
  chatMode: PropTypes.bool,
  description: PropTypes.string,
  descriptionShown: PropTypes.func,
  descriptionColor: PropTypes.string,
  onHide: PropTypes.func.isRequired,
  openDirectMessageChannel: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  userId: PropTypes.number,
  username: PropTypes.string,
  users: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number.isRequired }))
    .isRequired
};

function UserListModal({
  chatMode,
  description = '',
  descriptionColor = Color.green(),
  descriptionShown,
  onHide,
  openDirectMessageChannel,
  title,
  userId,
  username,
  users
}) {
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
                      logo
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
      openDirectMessageChannel(
        { id: userId, username },
        { id: user.id, username: user.username },
        chatMode
      );
    }
  }
}

export default connect(
  state => ({
    chatMode: state.ChatReducer.chatMode,
    userId: state.UserReducer.userId,
    username: state.UserReducer.username
  }),
  { openDirectMessageChannel }
)(UserListModal);
