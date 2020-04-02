import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Button from 'components/Button';
import TagForm from 'components/Forms/TagForm';
import Input from 'components/Texts/Input';
import { useAppContext, useChatContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import { css } from 'emotion';
import { socket } from 'constants/io';
import { mobileMaxWidth } from 'constants/css';
import { stringIsEmpty } from 'helpers/stringHelpers';

ClassroomChat.propTypes = {
  onBackClick: PropTypes.func,
  onHide: PropTypes.func.isRequired
};

export default function ClassroomChat({ onBackClick, onHide }) {
  const {
    requestHelpers: { createNewChat, searchUserToInvite }
  } = useAppContext();
  const {
    state: { userSearchResults },
    actions: {
      onClearUserSearchResults,
      onCreateNewChannel,
      onSearchUserToInvite
    }
  } = useChatContext();
  const { userId } = useMyState();
  const [channelName, setChannelName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const disabled = useMemo(
    () => stringIsEmpty(channelName) || selectedUsers.length === 0,
    [channelName, selectedUsers.length]
  );

  return (
    <ErrorBoundary>
      <header>New Classroom</header>
      <main>
        <div
          className={css`
            width: 80%;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
            }
          `}
        >
          <h3>Name</h3>
          <Input
            autoFocus
            style={{ marginTop: '1rem' }}
            placeholder="Enter the name of your class"
            maxLength="150"
            value={channelName}
            onChange={setChannelName}
          />
        </div>
        <TagForm
          title="Members"
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
          searchPlaceholder="Add the members of your class"
          selectedItems={selectedUsers}
          style={{ marginTop: '1.5rem' }}
          className={css`
            width: 80%;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
            }
          `}
        />
      </main>
      <footer>
        <Button
          style={{ marginRight: '0.7rem' }}
          transparent
          onClick={onBackClick || onHide}
        >
          {onBackClick ? 'Back' : 'Cancel'}
        </Button>
        <Button color="blue" onClick={handleDone} disabled={disabled}>
          Create
        </Button>
      </footer>
    </ErrorBoundary>
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

  async function handleDone() {
    const { message, isClass, isClosed, members } = await createNewChat({
      userId,
      channelName,
      isClass: true,
      isClosed: true,
      selectedUsers
    });
    onCreateNewChannel({ message, isClass, isClosed, members });
    const users = selectedUsers.map(user => user.id);
    socket.emit('join_chat_channel', message.channelId);
    socket.emit('send_group_chat_invitation', users, {
      message,
      isClass,
      isClosed,
      members
    });
    onHide();
  }
}
