import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Modal from 'components/Modal';

SelectFeaturedChallengesModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function SelectFeaturedChallengesModal({ onHide }) {
  return (
    <Modal large onHide={onHide}>
      <header>Select Featured Subjects</header>
      <main>select featured subjects here</main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button primary onClick={() => console.log('clicked')} disabled={true}>
          Done
        </Button>
      </footer>
    </Modal>
  );
}
