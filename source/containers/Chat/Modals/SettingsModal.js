import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import SwitchButton from 'components/SwitchButton';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { useChatContext } from 'contexts';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

SettingsModal.propTypes = {
  channelId: PropTypes.number,
  onDone: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  channelName: PropTypes.string,
  isClass: PropTypes.bool,
  isClosed: PropTypes.bool,
  userIsChannelOwner: PropTypes.bool,
  onChangeOwner: PropTypes.func.isRequired
};

export default function SettingsModal({
  channelId,
  isClass,
  isClosed,
  onDone,
  onHide,
  channelName,
  userIsChannelOwner,
  onChangeOwner
}) {
  const {
    state: { customChannelNames }
  } = useChatContext();
  const [editedChannelName, setEditedChannelName] = useState(channelName);
  const [editedIsClosed, setEditedIsClosed] = useState(isClosed);
  const disabled = useMemo(() => {
    const customChannelName = customChannelNames[channelId];
    let channelNameDidNotChange = editedChannelName === channelName;
    if (customChannelName !== channelName) {
      channelNameDidNotChange = false;
    }
    return (
      (stringIsEmpty(editedChannelName) || channelNameDidNotChange) &&
      isClosed === editedIsClosed
    );
  }, [
    channelId,
    channelName,
    customChannelNames,
    editedChannelName,
    editedIsClosed,
    isClosed
  ]);
  return (
    <Modal onHide={onHide}>
      <header>{userIsChannelOwner ? 'Settings' : 'Edit Channel Name'}</header>
      <main>
        <div
          className={css`
            width: 80%;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
            }
          `}
        >
          <div style={{ width: '100%' }}>
            {userIsChannelOwner && (
              <p style={{ fontWeight: 'bold', fontSize: '1.7rem' }}>
                Channel Name:
              </p>
            )}
            <Input
              style={{ marginTop: '0.5rem', width: '100%' }}
              autoFocus
              placeholder="Enter channel name..."
              value={editedChannelName}
              onChange={setEditedChannelName}
            />
          </div>
          {userIsChannelOwner && !isClass && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '1.5rem'
              }}
            >
              <p style={{ fontWeight: 'bold', fontSize: '1.7rem' }}>
                <span style={{ color: Color.logoBlue() }}>Anyone</span> can
                invite new members:
              </p>
              <SwitchButton
                style={{ marginLeft: '1rem' }}
                checked={!editedIsClosed}
                onChange={() => setEditedIsClosed(isClosed => !isClosed)}
              />
            </div>
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row'
            }}
          >
            {userIsChannelOwner && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '2rem'
                }}
              >
                <Button onClick={changeOwnerButton} default filled>
                  Change Owner
                </Button>
              </div>
            )}
          </div>
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

  function changeOwnerButton() {
    onHide();
    onChangeOwner();
  }
}
