import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import TagForm from 'components/Forms/TagForm';
import Input from 'components/Texts/Input';
import { useAppContext, useChatContext } from 'contexts';

CreateNewChannelModal.propTypes = {
  onDone: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired
};

export default function CreateNewChannelModal({ userId, onHide, onDone }) {
  const {
    requestHelpers: { searchUserToInvite }
  } = useAppContext();
  const {
    state: { userSearchResults },
    actions: { onClearUserSearchResults, onSearchUserToInvite }
  } = useChatContext();
  const [channelName, setChannelName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  return (
    <Modal onHide={onHide}>
      <header>Create New Channel</header>
      <main>
        <TagForm
          title="Who are the members of your channel?"
          itemLabel="username"
          searchResults={userSearchResults}
          filter={result => result.id !== userId}
          onSearch={handleSearchUserToInvite}
          onClear={onClearUserSearchResults}
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

  async function handleSearchUserToInvite(text) {
    const data = await searchUserToInvite(text);
    onSearchUserToInvite(data);
  }

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
