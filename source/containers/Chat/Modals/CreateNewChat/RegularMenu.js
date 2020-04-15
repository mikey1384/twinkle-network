import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Button from 'components/Button';
import TagForm from 'components/Forms/TagForm';
import Input from 'components/Texts/Input';
import SwitchButton from 'components/SwitchButton';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';
import { useAppContext, useChatContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

RegularMenu.propTypes = {
  onBackClick: PropTypes.func,
  onDone: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired
};

export default function RegularMenu({ onBackClick, onHide, onDone }) {
  const {
    requestHelpers: { searchUserToInvite }
  } = useAppContext();
  const {
    state: { userSearchResults },
    actions: { onClearUserSearchResults, onSearchUserToInvite }
  } = useChatContext();
  const { userId } = useMyState();
  const [channelName, setChannelName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isClosed, setIsClosed] = useState(false);

  return (
    <ErrorBoundary>
      <header>New Chat</header>
      <main>
        <TagForm
          autoFocus
          maxItems={5}
          title="Who are the members?"
          itemLabel="username"
          searchResults={userSearchResults}
          filter={(result) => result.id !== userId}
          onSearch={handleSearchUserToInvite}
          onClear={onClearUserSearchResults}
          channelName={channelName}
          onAddItem={onAddUser}
          onRemoveItem={onRemoveUser}
          renderDropdownLabel={(item) => (
            <span>
              {item.username}{' '}
              {item.realName && <small>{`(${item.realName})`}</small>}
            </span>
          )}
          searchPlaceholder="Search for people you want to chat with"
          selectedItems={selectedUsers}
          className={css`
            width: 80%;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
            }
          `}
        >
          {selectedUsers.length > 1 && (
            <div style={{ width: '100%' }}>
              <div style={{ marginTop: '1.5rem' }}>
                <h3>Channel name</h3>
                <Input
                  style={{ marginTop: '1rem' }}
                  placeholder="Enter channel name"
                  maxLength="150"
                  value={channelName}
                  onChange={setChannelName}
                />
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <SwitchButton
                  labelStyle={{ fontSize: '1.7rem', fontWeight: 'bold' }}
                  label={
                    <>
                      <span style={{ color: Color.logoBlue() }}>Anyone</span>{' '}
                      can invite new members:
                    </>
                  }
                  checked={!isClosed}
                  onChange={() => setIsClosed((isClosed) => !isClosed)}
                />
                <p>(You can change this setting later)</p>
              </div>
            </div>
          )}
        </TagForm>
      </main>
      <footer>
        <Button
          style={{ marginRight: '0.7rem' }}
          transparent
          onClick={onBackClick || onHide}
        >
          {onBackClick ? 'Back' : 'Cancel'}
        </Button>
        <Button
          color="blue"
          onClick={handleDone}
          disabled={
            (selectedUsers.length > 1 && !channelName) ||
            selectedUsers.length === 0 ||
            selectedUsers.length > 5
          }
        >
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
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  }

  function handleDone() {
    onDone({ userId, channelName, selectedUsers, isClosed });
  }
}
