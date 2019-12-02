import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import DropdownButton from 'components/Buttons/DropdownButton';
import { Color } from 'constants/css';
import { useAppContext, useManagementContext } from 'contexts';

EditModeratorModal.propTypes = {
  accountTypes: PropTypes.array,
  onHide: PropTypes.func.isRequired,
  target: PropTypes.object
};

export default function EditModeratorModal({ accountTypes, onHide, target }) {
  const {
    requestHelpers: { changeAccountType }
  } = useAppContext();
  const {
    actions: { onChangeModeratorAccountType }
  } = useManagementContext();
  const [selectedAccountType, setSelectedAccountType] = useState(
    target.userType
  );
  const editMenuItems = useMemo(() => {
    return accountTypes
      .filter(accountType => accountType.label !== selectedAccountType)
      .map(accountType => ({
        label: accountType.label,
        onClick: () => setSelectedAccountType(accountType.label)
      }));
  }, [accountTypes, selectedAccountType]);

  return (
    <Modal onHide={onHide}>
      <header style={{ display: 'block' }}>Change account type:</header>
      <main>
        <div
          style={{
            marginTop: '1rem',
            fontWeight: 'bold',
            fontSize: '2rem',
            color: Color.logoBlue()
          }}
        >
          {target.username}
        </div>
        <DropdownButton
          style={{ marginTop: '1rem' }}
          skeuomorphic
          text={selectedAccountType}
          color="darkerGray"
          menuProps={editMenuItems}
        />
      </main>
      <footer>
        <Button transparent onClick={onHide} style={{ marginRight: '0.7rem' }}>
          Cancel
        </Button>
        <Button
          color="blue"
          disabled={target.userType === selectedAccountType}
          onClick={handleSubmit}
        >
          Done
        </Button>
      </footer>
    </Modal>
  );

  async function handleSubmit() {
    await changeAccountType({ userId: target.id, selectedAccountType });
    onChangeModeratorAccountType({ userId: target.id, selectedAccountType });
    onHide();
  }
}
