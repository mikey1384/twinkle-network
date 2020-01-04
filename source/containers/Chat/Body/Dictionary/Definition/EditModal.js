import React, { useMemo, useEffect, useState } from 'react';
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
  const [nounIds, setNounIds] = useState([]);
  const nounsObj = useMemo(() => {
    const result = {};
    for (let noun of partOfSpeeches.nouns) {
      result[noun.id] = {
        id: noun.id,
        title: noun.definition
      };
    }
    return result;
  }, [partOfSpeeches.nouns]);
  useEffect(() => {
    setNounIds(partOfSpeeches.nouns.map(({ id }) => id));
  }, [partOfSpeeches.nouns]);

  return (
    <Modal large onHide={onHide}>
      <header>{`Edit Definitions of "${word}"`}</header>
      <main>
        <div>
          {nounIds.length > 0 && (
            <div>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>Noun</p>
              <SortableListGroup
                numbered
                style={{ marginTop: '1rem' }}
                listItemObj={nounsObj}
                onMove={handleNounsMove}
                itemIds={nounIds}
              />
            </div>
          )}
        </div>
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

  function handleNounsMove({ sourceId, targetId }) {
    const sourceIndex = nounIds.indexOf(sourceId);
    const targetIndex = nounIds.indexOf(targetId);
    const newNounIds = [...nounIds];
    newNounIds.splice(sourceIndex, 1);
    newNounIds.splice(targetIndex, 0, sourceId);
    setNounIds(newNounIds);
  }
}
