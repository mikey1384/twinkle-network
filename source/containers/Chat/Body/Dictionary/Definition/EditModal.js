import React, { useMemo, useEffect, useState } from 'react';
import Button from 'components/Button';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1';
import SortableListGroup from 'components/SortableListGroup';

EditModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  partOfSpeeches: PropTypes.object.isRequired,
  word: PropTypes.string.isRequired
};

export default function EditModal({ onHide, onSubmit, partOfSpeeches, word }) {
  const [definitionIds, setDefinitionIds] = useState([]);
  const definitionsObj = useMemo(() => {
    const result = {};
    for (let key in partOfSpeeches) {
      for (let definition of partOfSpeeches[key]) {
        const partOfSpeech = key.slice(0, -1);
        const id = uuidv1();
        result[id] = { id, title: `${partOfSpeech} ${definition}` };
      }
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const result = [];
    for (let key in definitionsObj) {
      result.push(key);
    }
    setDefinitionIds(result);
  }, [definitionsObj]);

  return (
    <Modal large onHide={onHide}>
      <header>{`Edit Definitions of "${word}"`}</header>
      <main>
        <SortableListGroup
          listItemObj={definitionsObj}
          onMove={handleMove}
          itemIds={definitionIds}
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
