import React, { useEffect, useMemo, useState } from 'react';
import Button from 'components/Button';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import PartOfSpeechBlock from './PartOfSpeechBlock';
import PartOfSpeechesList from './PartOfSpeechesList';
import TouchBackend from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { isMobile } from 'helpers';
import { capitalize } from 'helpers/stringHelpers';

EditModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  partOfSpeeches: PropTypes.object.isRequired,
  partOfSpeechOrder: PropTypes.array.isRequired,
  word: PropTypes.string.isRequired
};

const Backend = isMobile(navigator) ? TouchBackend : HTML5Backend;

export default function EditModal({
  onHide,
  onSubmit,
  partOfSpeeches,
  partOfSpeechOrder,
  word
}) {
  const [adjectiveIds, setAdjectiveIds] = useState([]);
  const [adverbIds, setAdverbIds] = useState([]);
  const [conjunctionIds, setConjunctionIds] = useState([]);
  const [interjectionIds, setInterjectionIds] = useState([]);
  const [nounIds, setNounIds] = useState([]);
  const [prepositionIds, setPrepositionIds] = useState([]);
  const [pronounIds, setPronounIds] = useState([]);
  const [verbIds, setVerbIds] = useState([]);
  const [otherIds, setOtherIds] = useState([]);
  const ids = useMemo(
    () => ({
      adjective: adjectiveIds,
      adverb: adverbIds,
      conjunction: conjunctionIds,
      interjection: interjectionIds,
      noun: nounIds,
      preposition: prepositionIds,
      pronoun: pronounIds,
      verb: verbIds,
      other: otherIds
    }),
    [
      adjectiveIds,
      adverbIds,
      conjunctionIds,
      interjectionIds,
      nounIds,
      otherIds,
      prepositionIds,
      pronounIds,
      verbIds
    ]
  );

  const setIds = useMemo(
    () => ({
      adjective: setAdjectiveIds,
      adverb: setAdverbIds,
      conjunction: setConjunctionIds,
      interjection: setInterjectionIds,
      noun: setNounIds,
      other: setOtherIds,
      preposition: setPrepositionIds,
      verb: setVerbIds
    }),
    []
  );

  const posObj = useMemo(() => {
    const result = {
      adjectives: {},
      adverbs: {},
      conjunctions: {},
      interjections: {},
      nouns: {},
      prepositions: {},
      pronouns: {},
      verbs: {},
      others: {}
    };
    for (let key in partOfSpeeches) {
      for (let partOfSpeech of partOfSpeeches[key]) {
        result[key][partOfSpeech.id] = {
          id: partOfSpeech.id,
          title: partOfSpeech.definition
        };
      }
    }
    return result;
  }, [partOfSpeeches]);

  useEffect(() => {
    setAdjectiveIds(partOfSpeeches.adjectives.map(({ id }) => id));
  }, [partOfSpeeches.adjectives]);

  useEffect(() => {
    setAdverbIds(partOfSpeeches.adverbs.map(({ id }) => id));
  }, [partOfSpeeches.adverbs]);

  useEffect(() => {
    setConjunctionIds(partOfSpeeches.conjunctions.map(({ id }) => id));
  }, [partOfSpeeches.conjunctions]);

  useEffect(() => {
    setInterjectionIds(partOfSpeeches.interjections.map(({ id }) => id));
  }, [partOfSpeeches.interjections]);

  useEffect(() => {
    setNounIds(partOfSpeeches.nouns.map(({ id }) => id));
  }, [partOfSpeeches.nouns]);

  useEffect(() => {
    setPrepositionIds(partOfSpeeches.prepositions.map(({ id }) => id));
  }, [partOfSpeeches.prepositions]);

  useEffect(() => {
    setPronounIds(partOfSpeeches.pronouns.map(({ id }) => id));
  }, [partOfSpeeches.pronouns]);

  useEffect(() => {
    setVerbIds(partOfSpeeches.verbs.map(({ id }) => id));
  }, [partOfSpeeches.verbs]);

  useEffect(() => {
    setOtherIds(partOfSpeeches.others.map(({ id }) => id));
  }, [partOfSpeeches.others]);

  return (
    <DndProvider backend={Backend}>
      <Modal large onHide={onHide}>
        <header>{`Edit Definitions of "${word}"`}</header>
        <main>
          <div style={{ display: 'flex', width: '100%' }}>
            <div
              style={{ display: 'flex', flexDirection: 'column', width: '60%' }}
            >
              {partOfSpeechOrder.map(pos => (
                <PartOfSpeechBlock
                  key={pos}
                  style={{ marginBottom: '1.5rem' }}
                  type={capitalize(pos)}
                  posIds={ids[pos]}
                  posObject={posObj[`${pos}s`]}
                  onListItemMove={params =>
                    handleItemsMove({
                      ...params,
                      setIds: setIds[pos],
                      ids: ids[pos]
                    })
                  }
                />
              ))}
            </div>
            <div
              style={{ width: '40%', marginLeft: '1rem', marginTop: '3.5rem' }}
            >
              <PartOfSpeechesList partOfSpeeches={partOfSpeechOrder} />
            </div>
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

  function handleItemsMove({ sourceId, targetId, ids, setIds }) {
    const newIds = [...ids];
    const sourceIndex = newIds.indexOf(sourceId);
    const targetIndex = newIds.indexOf(targetId);
    newIds.splice(sourceIndex, 1);
    newIds.splice(targetIndex, 0, sourceId);
    setIds(newIds);
  }
}
