import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Modal from 'components/Modal';
import Loading from 'components/Loading';
import SearchInput from 'components/Texts/SearchInput';
import { useSearch } from 'helpers/hooks';
import { useAppContext } from 'contexts';

AddModeratorModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function AddModeratorModal({ onHide }) {
  const {
    requestHelpers: { searchUsers }
  } = useAppContext();
  const [searchText, setSearchText] = useState('');
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { handleSearch, searching } = useSearch({
    onSearch: handleUserSearch,
    onClear: () => setSearchedUsers([]),
    onSetSearchText: setSearchText
  });
  return (
    <Modal onHide={onHide}>
      <header>Add Moderators</header>
      <main>
        <SearchInput
          autoFocus
          onChange={handleSearch}
          onSelect={handleSelectUser}
          placeholder="Search users..."
          renderItemLabel={item => (
            <span>
              {item.username} <small>{`(${item.realName})`}</small>
            </span>
          )}
          searchResults={searchedUsers}
          value={searchText}
        />
        {searching && (
          <Loading style={{ position: 'absolute', marginTop: '5rem' }} />
        )}
        <div style={{ marginTop: '1rem' }}>
          {selectedUsers.map(user => (
            <div key={user.id}>{user.username}</div>
          ))}
        </div>
      </main>
      <footer>
        <Button transparent onClick={onHide} style={{ marginRight: '0.7rem' }}>
          Cancel
        </Button>
        <Button color="blue" onClick={() => console.log('clicked')}>
          Done
        </Button>
      </footer>
    </Modal>
  );

  function handleSelectUser(user) {
    setSelectedUsers(users => users.concat(user));
    setSearchedUsers([]);
    setSearchText('');
  }

  async function handleUserSearch(text) {
    const users = await searchUsers(text);
    const result = users.filter(
      user =>
        !user.userType &&
        !selectedUsers.map(selectedUser => selectedUser.id).includes(user.id)
    );
    setSearchedUsers(result);
  }
}
