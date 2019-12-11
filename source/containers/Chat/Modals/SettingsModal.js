import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import { stringIsEmpty } from 'helpers/stringHelpers';

SettingsModal.propTypes = {
  onDone: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  channelName: PropTypes.string,
  userIsChannelOwner: PropTypes.bool
};

export default function SettingsModal({
  onDone,
  onHide,
  channelName,
  userIsChannelOwner
}) {
  const [editedChannelName, setEditedChannelName] = useState(channelName);

  return (
    <Modal onHide={onHide}>
      <header>{userIsChannelOwner ? 'Settings' : 'Edit Channel Name'}</header>
      <main>
        <div style={{ width: '50%' }}>
          {userIsChannelOwner && (
            <p style={{ fontWeight: 'bold', fontSize: '1.7rem' }}>
              Channel Name:
            </p>
          )}
          <Input
            style={{ marginTop: '1rem' }}
            autoFocus
            placeholder="Enter channel name..."
            value={editedChannelName}
            onChange={setEditedChannelName}
          />
        </div>
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button
          color="blue"
          disabled={
            stringIsEmpty(editedChannelName) ||
            editedChannelName === channelName
          }
          onClick={() => onDone(editedChannelName)}
        >
          Done
        </Button>
      </footer>
    </Modal>
  );
}
