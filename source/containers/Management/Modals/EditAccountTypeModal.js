import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import Table from '../Table';

EditAccountTypeModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  target: PropTypes.object
};

export default function EditAccountTypeModal({ onHide, target }) {
  const [accountLabel] = useState(target.label);
  const [authLevel] = useState(target.authLevel);
  return (
    <Modal onHide={onHide}>
      <header style={{ display: 'block' }}>Edit Account Types:</header>
      <main>
        <div
          style={{
            paddingBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            fontSize: '2rem'
          }}
        >
          <label style={{ fontWeight: 'bold' }}>Label: </label>
          <Input style={{ marginLeft: '1rem' }} value={accountLabel} />
        </div>
        <div
          style={{
            paddingBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            fontSize: '2rem'
          }}
        >
          <label style={{ fontWeight: 'bold' }}>Auth Level: </label>
          <Input style={{ marginLeft: '1rem' }} value={authLevel} />
        </div>
        <Table columns="2fr 1fr">
          <thead>
            <tr>
              <th>Perks</th>
              <th>Enabled</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Edit</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Delete</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Reward</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Pin Playlists</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Edit Playlists</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Edit Reward Level</td>
              <td>1</td>
            </tr>
          </tbody>
        </Table>
      </main>
      <footer>
        <Button transparent onClick={onHide} style={{ marginRight: '0.7rem' }}>
          Cancel
        </Button>
        <Button color="blue" onClick={onHide}>
          Done
        </Button>
      </footer>
    </Modal>
  );
}
