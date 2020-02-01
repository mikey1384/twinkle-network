import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import Check from '../Check';
import Table from '../Table';
import Icon from 'components/Icon';
import ConfirmModal from 'components/Modals/ConfirmModal';
import ErrorBoundary from 'components/ErrorBoundary';
import { css } from 'emotion';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { useAppContext, useManagementContext } from 'contexts';

EditAccountTypeModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  target: PropTypes.object
};

export default function EditAccountTypeModal({ onHide, target }) {
  const accountTypeObj = useMemo(() => {
    return target;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    requestHelpers: { deleteAccountType, editAccountType }
  } = useAppContext();
  const {
    actions: { onDeleteAccountType, onEditAccountType }
  } = useManagementContext();
  const [accountLabel, setAccountLabel] = useState(accountTypeObj.label);
  const [deleteModalShown, setDeleteModalShown] = useState(false);
  const [authLevel, setAuthLevel] = useState(accountTypeObj.authLevel);
  const [perks, setPerks] = useState({
    canEdit: false,
    canDelete: false,
    canStar: false,
    canPinPlaylists: false,
    canEditDictionary: false,
    canEditPlaylists: false,
    canEditRewardLevel: false
  });

  useEffect(() => {
    for (let key in accountTypeObj) {
      if (key === 'label' || key === 'authLevel' || key === 'id') continue;
      setPerks(perk => ({
        ...perk,
        [key]: !!accountTypeObj[key]
      }));
    }
  }, [accountTypeObj]);

  const disabled = useMemo(() => {
    for (let key in perks) {
      if (!!accountTypeObj[key] !== perks[key]) return false;
    }
    if (!stringIsEmpty(accountLabel) && accountLabel !== accountTypeObj.label) {
      return false;
    }
    if (authLevel !== accountTypeObj.authLevel) {
      return false;
    }
    return true;
  }, [accountLabel, authLevel, perks, accountTypeObj]);

  return (
    <ErrorBoundary>
      <Modal onHide={onHide}>
        <header style={{ display: 'block' }}>Edit Account Type:</header>
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
              style={{ marginLeft: '1rem', width: 'auto' }}
              placeholder="Enter label..."
              value={accountLabel}
              onChange={setAccountLabel}
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
                    canEditDictionary: !perk.canEditDictionary
                  }))
                }
              >
                <td style={{ fontWeight: 'bold' }}>Can Edit Dictionary</td>
                <td style={{ textAlign: 'center' }}>
                  <Check checked={perks.canEditDictionary} />
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
        <footer style={{ justifyContent: 'space-between' }}>
          <div>
            <Button
              transparent
              color="red"
              onClick={() => setDeleteModalShown(true)}
              style={{ marginRight: '0.7rem' }}
            >
              <Icon icon="trash-alt" />
              <span style={{ marginLeft: '1rem' }}>Remove</span>
            </Button>
          </div>
          <div style={{ display: 'flex' }}>
            <Button
              transparent
              onClick={onHide}
              style={{ marginRight: '0.7rem' }}
            >
              Cancel
            </Button>
            <Button color="blue" disabled={disabled} onClick={handleSubmit}>
              Done
            </Button>
          </div>
        </footer>
        {deleteModalShown && (
          <ConfirmModal
            modalOverModal
            onConfirm={handleDeleteAccountType}
            onHide={() => setDeleteModalShown(false)}
            title="Remove Account Type"
          />
        )}
      </Modal>
    </ErrorBoundary>
  );

  async function handleDeleteAccountType() {
    await deleteAccountType(accountTypeObj.label);
    onDeleteAccountType(accountTypeObj.label);
    onHide();
  }

  async function handleSubmit() {
    const editedAccountType = {
      label: accountLabel,
      authLevel,
      ...perks
    };
    await editAccountType({ label: accountTypeObj.label, editedAccountType });
    onEditAccountType({ label: accountTypeObj.label, editedAccountType });
    onHide();
  }
}
