import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import SwitchButton from 'components/SwitchButton';
import SelectNewOwnerModal from './SelectNewOwnerModal';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { useChatContext } from 'contexts';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

SettingsModal.propTypes = {
  channelId: PropTypes.number,
  members: PropTypes.array,
  onDone: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  channelName: PropTypes.string,
  isClass: PropTypes.bool,
  isClosed: PropTypes.bool,
  userIsChannelOwner: PropTypes.bool,
  onSelectNewOwner: PropTypes.func
};

export default function SettingsModal({
  channelId,
  channelName,
  isClass,
  isClosed,
  members,
  onDone,
  onHide,
  onSelectNewOwner,
  userIsChannelOwner
}) {
  const {
    state: { customChannelNames }
  } = useChatContext();
  const [selectNewOwnerModalShown, setSelectNewOwnerModalShown] = useState(
    false
  );
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
      <header>{userIsChannelOwner ? 'Settings' : 'Edit Group Name'}</header>
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
                onChange={() => setEditedIsClosed((isClosed) => !isClosed)}
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
                <Button
                  onClick={() => setSelectNewOwnerModalShown(true)}
                  default
                  filled
                >
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
      {selectNewOwnerModalShown && (
        <SelectNewOwnerModal
          modalOverModal
          onHide={() => setSelectNewOwnerModalShown(false)}
          members={members}
          onSubmit={({ newOwner }) => {
            onSelectNewOwner({ newOwner });
            onHide();
          }}
          isClass={isClass}
        />
      )}
    </Modal>
  );
}
