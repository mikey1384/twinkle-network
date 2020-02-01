import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import SearchInput from 'components/Texts/SearchInput';
import { useMyState } from 'helpers/hooks';
import { stringIsEmpty } from 'helpers/stringHelpers';
import CheckListGroup from 'components/CheckListGroup';

SelectNewOwnerModal.propTypes = {
  members: PropTypes.array.isRequired,
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default function SelectNewOwnerModal({ members, onHide, onSubmit }) {
  const { userId } = useMyState();
  const [searchText, setSearchText] = useState('');
  const shownMembers = useMemo(() => {
    return members.filter(
      member =>
        member.id !== userId &&
        (stringIsEmpty(searchText) || member.username.includes(searchText))
    );
  }, [members, searchText, userId]);
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <Modal onHide={onHide}>
      <header>Select New Channel Owner</header>
      <main>
        <SearchInput
          autoFocus
          onChange={text => setSearchText(text)}
          placeholder="Search users..."
          value={searchText}
        />
        <CheckListGroup
          style={{ marginTop: '1.5rem' }}
          onSelect={index => setSelectedUser(shownMembers[index])}
          listItems={shownMembers.map(member => ({
            label: member.username,
            checked: member.id === selectedUser?.id
          }))}
        />
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button
          color="blue"
          disabled={!selectedUser}
          onClick={() => onSubmit(selectedUser)}
        >
          Done
        </Button>
      </footer>
    </Modal>
  );
}
