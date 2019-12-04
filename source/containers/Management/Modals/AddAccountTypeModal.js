import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import Check from '../Check';
import Table from '../Table';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { css } from 'emotion';
import { useAppContext, useManagementContext } from 'contexts';

AddAccountTypeModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function AddAccountTypeModal({ onHide }) {
  const {
    requestHelpers: { addAccountType }
  } = useAppContext();
  const {
    actions: { onAddAccountType }
  } = useManagementContext();
  const [accountLabel, setAccountLabel] = useState('');
  const [authLevel, setAuthLevel] = useState(0);
  const [perks, setPerks] = useState({
    canEdit: false,
    canDelete: false,
    canStar: false,
    canPinPlaylists: false,
    canEditPlaylists: false,
    canEditRewardLevel: false
  });
  const disabled = useMemo(() => {
    if (stringIsEmpty(accountLabel)) return true;
    for (let key in perks) {
      if (perks[key]) return false;
    }
    return true;
  }, [accountLabel, perks]);

  return (
    <Modal onHide={onHide}>
      <header style={{ display: 'block' }}>Add Account Type:</header>
      <main>
        <div
          style={{
            paddingBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            fontSize: '1.7rem'
          }}
        >
          <label style={{ fontWeight: 'bold' }}>Label: </label>
          <Input
            autoFocus
            style={{ marginLeft: '1rem', width: 'auto' }}
            value={accountLabel}
            onChange={setAccountLabel}
            placeholder="Enter label..."
          />
        </div>
        <div
          style={{
            paddingBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            fontSize: '1.7rem'
          }}
        >
          <label style={{ fontWeight: 'bold' }}>Auth Level: </label>
          <Input
            type="text"
            style={{ marginLeft: '1rem', width: 'auto' }}
            value={authLevel}
            onChange={text => {
              if (isNaN(Number(text))) return setAuthLevel(0);
              const numberString = String(text % 100);
              const number = Number(numberString.replace(/^0+/, ''));
              setAuthLevel(number);
            }}
          />
        </div>
        <Table columns="2fr 1fr">
          <thead>
            <tr>
              <th>Perks</th>
              <th></th>
            </tr>
          </thead>
          <tbody
            className={`${css`
              tr {
                cursor: pointer;
              }
            `} unselectable`}
          >
            <tr
              onClick={() =>
                setPerks(perk => ({
                  ...perk,
                  canEdit: !perk.canEdit
                }))
              }
            >
              <td style={{ fontWeight: 'bold' }}>Can Edit</td>
              <td style={{ textAlign: 'center' }}>
                <Check checked={perks.canEdit} />
              </td>
            </tr>
            <tr
              onClick={() =>
                setPerks(perk => ({
                  ...perk,
                  canDelete: !perk.canDelete
                }))
              }
            >
              <td style={{ fontWeight: 'bold' }}>Can Delete</td>
              <td style={{ textAlign: 'center' }}>
                <Check checked={perks.canDelete} />
              </td>
            </tr>
            <tr
              onClick={() =>
                setPerks(perk => ({
                  ...perk,
                  canStar: !perk.canStar
                }))
              }
            >
              <td style={{ fontWeight: 'bold' }}>Can Reward</td>
              <td style={{ textAlign: 'center' }}>
                <Check checked={perks.canStar} />
              </td>
            </tr>
            <tr
              onClick={() =>
                setPerks(perk => ({
                  ...perk,
                  canPinPlaylists: !perk.canPinPlaylists
                }))
              }
            >
              <td style={{ fontWeight: 'bold' }}>Can Feature Contents</td>
              <td style={{ textAlign: 'center' }}>
                <Check checked={perks.canPinPlaylists} />
              </td>
            </tr>
            <tr
              onClick={() =>
                setPerks(perk => ({
                  ...perk,
                  canEditPlaylists: !perk.canEditPlaylists
                }))
              }
            >
              <td style={{ fontWeight: 'bold' }}>Can Edit Playlists</td>
              <td style={{ textAlign: 'center' }}>
                <Check checked={perks.canEditPlaylists} />
              </td>
            </tr>
            <tr
              onClick={() =>
                setPerks(perk => ({
                  ...perk,
                  canEditRewardLevel: !perk.canEditRewardLevel
                }))
              }
            >
              <td style={{ fontWeight: 'bold' }}>Can Edit Reward Level</td>
              <td style={{ textAlign: 'center' }}>
                <Check checked={perks.canEditRewardLevel} />
              </td>
            </tr>
          </tbody>
        </Table>
      </main>
      <footer>
        <Button transparent onClick={onHide} style={{ marginRight: '0.7rem' }}>
          Cancel
        </Button>
        <Button color="blue" disabled={disabled} onClick={handleSubmit}>
          Done
        </Button>
      </footer>
    </Modal>
  );

  async function handleSubmit() {
    const accountType = {
      label: accountLabel,
      authLevel,
      ...perks
    };
    await addAccountType(accountType);
    onAddAccountType(accountType);
    onHide();
  }
}
