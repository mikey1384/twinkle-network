import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import PartOfSpeechBlock from './PartOfSpeechBlock';
import PartOfSpeechesList from './PartOfSpeechesList';
import { capitalize } from 'helpers/stringHelpers';
import { isEqual } from 'lodash';
import { useAppContext } from 'contexts';
import Button from 'components/Button';

EditTab.propTypes = {
  onEditWord: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  partOfSpeeches: PropTypes.object.isRequired,
  originalPosOrder: PropTypes.array.isRequired,
  posObj: PropTypes.object.isRequired,
  word: PropTypes.string.isRequired
};

export default function EditTab({
  onEditWord,
  onHide,
  partOfSpeeches,
  originalPosOrder,
  posObj,
  word
}) {
  const {
    requestHelpers: { editWord }
  } = useAppContext();
  const [posting, setPosting] = useState(false);
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
      isEqual(originalPosOrder, poses) && isEqual(originalIds, allDefinitionIds)
    );
  }, [
    allDefinitionIds,
    originalPosOrder,
    partOfSpeeches.adjective,
    partOfSpeeches.adverb,
    partOfSpeeches.conjunction,
    partOfSpeeches.interjection,
    partOfSpeeches.noun,
    partOfSpeeches.other,
    partOfSpeeches.preposition,
    partOfSpeeches.pronoun,
    partOfSpeeches.verb,
    poses
  ]);

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

  useEffect(() => {
    setPoses(originalPosOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <main>
        <div style={{ display: 'flex', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '60%'
            }}
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
            style={{
              width: '40%',
              marginLeft: '1rem',
              marginTop: '3.5rem'
            }}
          >
            <PartOfSpeechesList
              partOfSpeeches={poses}
              onListItemMove={handlePosMove}
            />
          </div>
        </div>
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button
          color="blue"
          disabled={disabled || posting}
          onClick={() => handleEditDone({ poses, allDefinitionIds })}
        >
          Done
        </Button>
      </footer>
    </>
  );

  function handleDefinitionsMove({ sourceId, targetId, ids, setIds }) {
    const newIds = [...ids];
    const sourceIndex = newIds.indexOf(sourceId);
    const targetIndex = newIds.indexOf(targetId);
    newIds.splice(sourceIndex, 1);
    newIds.splice(targetIndex, 0, sourceId);
    setIds(newIds);
  }

  async function handleEditDone({ poses, allDefinitionIds }) {
    setPosting(true);
    const definitions = [];
    for (let key in posObj) {
      for (let id of allDefinitionIds[key]) {
        const definition = posObj[key][id].title;
        definitions.push({ definition, partOfSpeech: key });
      }
    }
    await editWord({
      partOfSpeeches: poses,
      definitions,
      word
    });
    onEditWord({
      partOfSpeeches: poses,
      definitions,
      word
    });
    setPosting(false);
    onHide();
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
