import React, { useMemo } from 'react';
import Button from 'components/Button';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';

EditModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  partOfSpeeches: PropTypes.object.isRequired,
  word: PropTypes.string.isRequired
};

export default function EditModal({ onHide, onSubmit, partOfSpeeches, word }) {
  const allDefinitions = useMemo(() => {
    const result = [];
    for (let key in partOfSpeeches) {
      for (let definition of partOfSpeeches[key]) {
        const partOfSpeech = key.slice(0, -1);
        result.push({ partOfSpeech, definition });
      }
    }
    return result;
  }, [partOfSpeeches]);

  return (
    <Modal large onHide={onHide}>
      <header>{`Edit Definitions of "${word}"`}</header>
      <main>
        {allDefinitions.map(({ definition, partOfSpeech }) => (
          <div key={definition}>
            {definition} ({partOfSpeech})
          </div>
        ))}
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button color="blue" onClick={onSubmit}>
          Done
        </Button>
      </footer>
    </Modal>
  );
}
