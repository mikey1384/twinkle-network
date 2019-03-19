import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import TagForm from 'components/Forms/TagForm';
import { connect } from 'react-redux';
import {
  clearUserSearchResults,
  searchUserToInvite,
  inviteUsersToChannel
} from 'redux/actions/ChatActions';

InviteUsersModal.propTypes = {
  clearSearchResults: PropTypes.func.isRequired,
  currentChannel: PropTypes.object.isRequired,
  inviteUsersToChannel: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
  searchUserToInvite: PropTypes.func.isRequired
};

function InviteUsersModal({
  clearSearchResults,
  inviteUsersToChannel,
  searchUserToInvite,
  searchResults,
  onDone,
  onHide,
  currentChannel
}) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const currentMembersUID = currentChannel.members.map(member => member.userId);

  return (
    <Modal onHide={onHide}>
      <header>Invite people to this channel</header>
      <main>
        <TagForm
          title="People"
          itemLabel="username"
          searchResults={searchResults}
          filter={result => currentMembersUID.indexOf(result.id) === -1}
          onSearch={searchUserToInvite}
          onClear={clearSearchResults}
          onAddItem={onAddUser}
          onRemoveItem={onRemoveUser}
          onSubmit={selectedUsers.length > 0 && handleDone}
          renderDropdownLabel={item => (
            <span>
              {item.username}{' '}
              {item.realName && <small>{`(${item.realName})`}</small>}
            </span>
          )}
          searchPlaceholder="Search for people you want to chat with"
          selectedItems={selectedUsers}
        />
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button
          color="blue"
          onClick={handleDone}
          disabled={selectedUsers.length === 0}
        >
          Invite
        </Button>
      </footer>
    </Modal>
  );

  function onAddUser(user) {
    setSelectedUsers(selectedUsers.concat([user]));
  }

  function onRemoveUser(userId) {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  }

  async function handleDone() {
    const message = await inviteUsersToChannel({
      selectedUsers,
      channelId: currentChannel.id
    });
    onDone(selectedUsers.map(user => user.id), message);
  }
}

export default connect(
  state => ({
    searchResults: state.ChatReducer.userSearchResults
  }),
  {
    clearSearchResults: clearUserSearchResults,
    searchUserToInvite,
    inviteUsersToChannel
  }
)(InviteUsersModal);
