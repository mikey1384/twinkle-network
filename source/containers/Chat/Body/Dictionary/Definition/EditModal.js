import React, { useMemo } from 'react';
import Button from 'components/Button';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import PartOfSpeechBlock from './PartOfSpeechBlock';

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
      result[noun.id] = {
        id: noun.id,
        title: noun.definition
      };
    }
    return result;
  }, [partOfSpeeches.nouns]);

  const adjectivesObj = useMemo(() => {
    const result = {};
    for (let adjective of partOfSpeeches.adjectives) {
      result[adjective.id] = {
        id: adjective.id,
        title: adjective.definition
      };
    }
    return result;
  }, [partOfSpeeches.adjectives]);

  return (
    <Modal large onHide={onHide}>
      <header>{`Edit Definitions of "${word}"`}</header>
      <main>
        <div>
          <PartOfSpeechBlock
            posIds={partOfSpeeches.nouns.map(({ id }) => id)}
            partOfSpeech="noun"
            posObject={nounsObj}
          />
          <PartOfSpeechBlock
            posIds={partOfSpeeches.adjectives.map(({ id }) => id)}
            partOfSpeech="adjective"
            posObject={adjectivesObj}
          />
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
}
