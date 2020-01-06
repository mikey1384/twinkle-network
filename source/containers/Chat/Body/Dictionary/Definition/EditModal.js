import React, { useEffect, useMemo, useState } from 'react';
import Button from 'components/Button';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import PartOfSpeechBlock from './PartOfSpeechBlock';
import TouchBackend from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { isMobile } from 'helpers';

EditModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  partOfSpeeches: PropTypes.object.isRequired,
  word: PropTypes.string.isRequired
};

const Backend = isMobile(navigator) ? TouchBackend : HTML5Backend;

export default function EditModal({ onHide, onSubmit, partOfSpeeches, word }) {
  const [nounIds, setNounIds] = useState([]);
  const [adjectiveIds, setAdjectiveIds] = useState([]);
  const [verbIds, setVerbIds] = useState([]);
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

  const verbsObj = useMemo(() => {
    const result = {};
    for (let verb of partOfSpeeches.verbs) {
      result[verb.id] = {
        id: verb.id,
        title: verb.definition
      };
    }
    return result;
  }, [partOfSpeeches.verbs]);

  useEffect(() => {
    setNounIds(partOfSpeeches.nouns.map(({ id }) => id));
  }, [partOfSpeeches.nouns]);

  useEffect(() => {
    setAdjectiveIds(partOfSpeeches.adjectives.map(({ id }) => id));
  }, [partOfSpeeches.adjectives]);

  useEffect(() => {
    setVerbIds(partOfSpeeches.verbs.map(({ id }) => id));
  }, [partOfSpeeches.verbs]);

  return (
    <DndProvider backend={Backend}>
      <Modal large onHide={onHide}>
        <header>{`Edit Definitions of "${word}"`}</header>
        <main>
          <div>
            <PartOfSpeechBlock
              type="Noun"
              posIds={nounIds}
              posObject={nounsObj}
              onListItemMove={handleNounItemsMove}
            />
            <PartOfSpeechBlock
              style={{ marginTop: '1.5rem' }}
              type="Adjective"
              posIds={adjectiveIds}
              posObject={adjectivesObj}
              onListItemMove={handleAdjectiveItemsMove}
            />
            <PartOfSpeechBlock
              style={{ marginTop: '1.5rem' }}
              type="Verb"
              posIds={verbIds}
              posObject={verbsObj}
              onListItemMove={handleVerbItemsMove}
            />
          </div>
        </main>
        <footer>
          <Button
            transparent
            style={{ marginRight: '0.7rem' }}
            onClick={onHide}
          >
            Cancel
          </Button>
          <Button color="blue" onClick={onSubmit}>
            Done
          </Button>
        </footer>
      </Modal>
    </DndProvider>
  );

  function handleAdjectiveItemsMove({ sourceId, targetId }) {
    const newIds = [...adjectiveIds];
    const sourceIndex = newIds.indexOf(sourceId);
    const targetIndex = newIds.indexOf(targetId);
    newIds.splice(sourceIndex, 1);
    newIds.splice(targetIndex, 0, sourceId);
    setAdjectiveIds(newIds);
  }

  function handleNounItemsMove({ sourceId, targetId }) {
    const newIds = [...nounIds];
    const sourceIndex = newIds.indexOf(sourceId);
    const targetIndex = newIds.indexOf(targetId);
    newIds.splice(sourceIndex, 1);
    newIds.splice(targetIndex, 0, sourceId);
    setNounIds(newIds);
  }

  function handleVerbItemsMove({ sourceId, targetId }) {
    const newIds = [...verbIds];
    const sourceIndex = newIds.indexOf(sourceId);
    const targetIndex = newIds.indexOf(targetId);
    newIds.splice(sourceIndex, 1);
    newIds.splice(targetIndex, 0, sourceId);
    setNounIds(newIds);
  }
}
