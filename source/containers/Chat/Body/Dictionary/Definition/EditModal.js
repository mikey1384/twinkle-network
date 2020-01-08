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
import { isEqual } from 'lodash';

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
  const [poses, setPoses] = useState([]);
  const [adjectiveIds, setAdjectiveIds] = useState([]);
  const [adverbIds, setAdverbIds] = useState([]);
  const [conjunctionIds, setConjunctionIds] = useState([]);
  const [interjectionIds, setInterjectionIds] = useState([]);
  const [nounIds, setNounIds] = useState([]);
  const [prepositionIds, setPrepositionIds] = useState([]);
  const [pronounIds, setPronounIds] = useState([]);
  const [verbIds, setVerbIds] = useState([]);
  const [otherIds, setOtherIds] = useState([]);
  const allDefinitionIds = useMemo(
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
      adjective: {},
      adverb: {},
      conjunction: {},
      interjection: {},
      noun: {},
      preposition: {},
      pronoun: {},
      verb: {},
      other: {}
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
    setPoses(
      partOfSpeechOrder.filter(pos => Object.keys(posObj[pos]).length > 0)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setAdjectiveIds(partOfSpeeches.adjective.map(({ id }) => id));
  }, [partOfSpeeches.adjective]);

  useEffect(() => {
    setAdverbIds(partOfSpeeches.adverb.map(({ id }) => id));
  }, [partOfSpeeches.adverb]);

  useEffect(() => {
    setConjunctionIds(partOfSpeeches.conjunction.map(({ id }) => id));
  }, [partOfSpeeches.conjunction]);

  useEffect(() => {
    setInterjectionIds(partOfSpeeches.interjection.map(({ id }) => id));
  }, [partOfSpeeches.interjection]);

  useEffect(() => {
    setNounIds(partOfSpeeches.noun.map(({ id }) => id));
  }, [partOfSpeeches.noun]);

  useEffect(() => {
    setPrepositionIds(partOfSpeeches.preposition.map(({ id }) => id));
  }, [partOfSpeeches.preposition]);

  useEffect(() => {
    setPronounIds(partOfSpeeches.pronoun.map(({ id }) => id));
  }, [partOfSpeeches.pronoun]);

  useEffect(() => {
    setVerbIds(partOfSpeeches.verb.map(({ id }) => id));
  }, [partOfSpeeches.verb]);

  useEffect(() => {
    setOtherIds(partOfSpeeches.other.map(({ id }) => id));
  }, [partOfSpeeches.other]);

  const disabled = useMemo(() => {
    const originalPoses = partOfSpeechOrder.filter(
      pos => Object.keys(posObj[pos]).length > 0
    );
    const originalIds = {
      adjective: partOfSpeeches.adjective.map(({ id }) => id),
      adverb: partOfSpeeches.adverb.map(({ id }) => id),
      conjunction: partOfSpeeches.conjunction.map(({ id }) => id),
      interjection: partOfSpeeches.interjection.map(({ id }) => id),
      noun: partOfSpeeches.noun.map(({ id }) => id),
      preposition: partOfSpeeches.preposition.map(({ id }) => id),
      pronoun: partOfSpeeches.pronoun.map(({ id }) => id),
      verb: partOfSpeeches.verb.map(({ id }) => id),
      other: partOfSpeeches.other.map(({ id }) => id)
    };
    return (
      isEqual(originalPoses, poses) && isEqual(originalIds, allDefinitionIds)
    );
  }, [
    allDefinitionIds,
    partOfSpeechOrder,
    partOfSpeeches.adjective,
    partOfSpeeches.adverb,
    partOfSpeeches.conjunction,
    partOfSpeeches.interjection,
    partOfSpeeches.noun,
    partOfSpeeches.other,
    partOfSpeeches.preposition,
    partOfSpeeches.pronoun,
    partOfSpeeches.verb,
    posObj,
    poses
  ]);

  return (
    <DndProvider backend={Backend}>
      <Modal large onHide={onHide}>
        <header>{`Edit Definitions of "${word}"`}</header>
        <main>
          <div style={{ display: 'flex', width: '100%' }}>
            <div
              style={{ display: 'flex', flexDirection: 'column', width: '60%' }}
            >
              {poses.map(pos => (
                <PartOfSpeechBlock
                  key={pos}
                  style={{ marginBottom: '1.5rem' }}
                  type={capitalize(pos)}
                  posIds={allDefinitionIds[pos]}
                  posObject={posObj[pos]}
                  onListItemMove={params =>
                    handleDefinitionsMove({
                      ...params,
                      setIds: setIds[pos],
                      ids: allDefinitionIds[pos]
                    })
                  }
                />
              ))}
            </div>
            <div
              style={{ width: '40%', marginLeft: '1rem', marginTop: '3.5rem' }}
            >
              <PartOfSpeechesList
                partOfSpeeches={poses}
                onListItemMove={handlePosMove}
              />
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
          <Button
            color="blue"
            disabled={disabled}
            onClick={() => onSubmit({ poses, allDefinitionIds })}
          >
            Done
          </Button>
        </footer>
      </Modal>
    </DndProvider>
  );

  function handleDefinitionsMove({ sourceId, targetId, ids, setIds }) {
    const newIds = [...ids];
    const sourceIndex = newIds.indexOf(sourceId);
    const targetIndex = newIds.indexOf(targetId);
    newIds.splice(sourceIndex, 1);
    newIds.splice(targetIndex, 0, sourceId);
    setIds(newIds);
  }

  function handlePosMove({ sourceId: sourcePos, targetId: targetPos }) {
    const newPoses = [...poses];
    const sourceIndex = newPoses.indexOf(sourcePos);
    const targetIndex = newPoses.indexOf(targetPos);
    newPoses.splice(sourceIndex, 1);
    newPoses.splice(targetIndex, 0, sourcePos);
    setPoses(newPoses);
  }
}
