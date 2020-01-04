import React, { useMemo } from 'react';
import Button from 'components/Button';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import SortableListGroup from 'components/SortableListGroup';

EditModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  partOfSpeeches: PropTypes.object.isRequired,
  word: PropTypes.string.isRequired
};

export default function EditModal({ onHide, onSubmit, partOfSpeeches, word }) {
  const nounsObj = useMemo(() => {
    const result = {};
    for (let noun of partOfSpeeches.nouns) {
      result[noun.id] = { id: noun.id, title: noun.definition };
    }
    return result;
  }, [partOfSpeeches.nouns]);
  const nounIds = useMemo(() => {
    return partOfSpeeches.nouns.map(({ id }) => id);
  }, [partOfSpeeches.nouns]);

  return (
    <Modal large onHide={onHide}>
      <header>{`Edit Definitions of "${word}"`}</header>
      <main>
        <p>Nouns</p>
        <SortableListGroup
          listItemObj={nounsObj}
          onMove={handleMove}
          itemIds={nounIds}
        />
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

  function handleMove(result) {
    console.log(result);
  }
}
