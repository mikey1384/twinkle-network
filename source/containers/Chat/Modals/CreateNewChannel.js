import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import {
  searchUserToInvite,
  clearUserSearchResults
} from 'redux/actions/ChatActions';
import { connect } from 'react-redux';
import TagForm from 'components/Forms/TagForm';
import Input from 'components/Texts/Input';

CreateNewChannelModal.propTypes = {
  clearSearchResults: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  searchResults: PropTypes.array.isRequired,
  searchUserToInvite: PropTypes.func.isRequired
};

function CreateNewChannelModal({
  userId,
  onHide,
  clearSearchResults,
  onDone,
  searchUserToInvite,
  searchResults
}) {
  const [channelName, setChannelName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  return (
    <Modal onHide={onHide}>
      <header>New Chat</header>
      <main>
        <TagForm
          title="People"
          itemLabel="username"
          searchResults={searchResults}
          filter={result => result.id !== userId}
          onSearch={searchUserToInvite}
          onClear={clearSearchResults}
          channelName={channelName}
          onAddItem={onAddUser}
          onRemoveItem={onRemoveUser}
          renderDropdownLabel={item => (
            <span>
              {item.username}{' '}
              {item.realName && <small>{`(${item.realName})`}</small>}
            </span>
          )}
          searchPlaceholder="Search for people you want to chat with"
          selectedItems={selectedUsers}
        >
          {selectedUsers.length > 1 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h3>Channel name</h3>
              <Input
                style={{ marginTop: '1rem' }}
                placeholder="Enter channel name"
                value={channelName}
                onChange={setChannelName}
              />
            </div>
          )}
        </TagForm>
      </main>
      <footer>
        <Button style={{ marginRight: '0.7rem' }} transparent onClick={onHide}>
          Cancel
        </Button>
        <Button
          color="blue"
          onClick={handleDone}
          disabled={
            (selectedUsers.length > 1 && !channelName) ||
            selectedUsers.length === 0
          }
        >
          Create
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

  function handleDone() {
    onDone({ userId, channelName, selectedUsers });
  }
}

export default connect(
  state => ({
    searchResults: state.ChatReducer.userSearchResults
  }),
  {
    clearSearchResults: clearUserSearchResults,
    searchUserToInvite
  }
)(CreateNewChannelModal);
