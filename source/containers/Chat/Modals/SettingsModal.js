import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import SwitchButton from 'components/SwitchButton';
import { stringIsEmpty } from 'helpers/stringHelpers';

SettingsModal.propTypes = {
  onDone: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  channelName: PropTypes.string,
  isClosed: PropTypes.bool,
  userIsChannelOwner: PropTypes.bool
};

export default function SettingsModal({
  isClosed,
  onDone,
  onHide,
  channelName,
  userIsChannelOwner
}) {
  const [editedChannelName, setEditedChannelName] = useState(channelName);
  const [editedIsClosed, setEditedIsClosed] = useState(isClosed);
  const disabled = useMemo(() => {
    return (
      (stringIsEmpty(editedChannelName) || editedChannelName === channelName) &&
      isClosed === editedIsClosed
    );
  }, [channelName, editedChannelName, editedIsClosed, isClosed]);
  return (
    <Modal onHide={onHide}>
      <header>{userIsChannelOwner ? 'Settings' : 'Edit Channel Name'}</header>
      <main>
        {userIsChannelOwner && (
          <SwitchButton
            labelStyle={{ fontSize: '1.7rem', fontWeight: 'bold' }}
            label="Only I can invite new members:"
            checked={editedIsClosed}
            onChange={() => setEditedIsClosed(isClosed => !isClosed)}
          />
        )}
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
          disabled={disabled}
          onClick={() => onDone({ editedChannelName, editedIsClosed })}
        >
          Done
        </Button>
      </footer>
    </Modal>
  );
}
