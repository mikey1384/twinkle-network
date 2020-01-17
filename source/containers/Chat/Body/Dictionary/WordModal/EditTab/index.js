import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import PartOfSpeechBlock from './PartOfSpeechBlock';
import PartOfSpeechesList from './PartOfSpeechesList';
import { isEqual } from 'lodash';
import { useAppContext } from 'contexts';
import Button from 'components/Button';

EditTab.propTypes = {
  definitionIds: PropTypes.object.isRequired,
  onEditWord: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  partOfSpeeches: PropTypes.object.isRequired,
  originalPosOrder: PropTypes.array.isRequired,
  posObj: PropTypes.object.isRequired,
  onSetDefinitionIds: PropTypes.object.isRequired,
  word: PropTypes.string.isRequired
};

export default function EditTab({
  definitionIds,
  onEditWord,
  onHide,
  partOfSpeeches,
  originalPosOrder,
  posObj,
  onSetDefinitionIds,
  word
}) {
  const {
    requestHelpers: { editWord }
  } = useAppContext();
  const [posting, setPosting] = useState(false);
  const [poses, setPoses] = useState([]);

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
      isEqual(originalPosOrder, poses) && isEqual(originalIds, definitionIds)
    );
  }, [
    definitionIds,
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

  useEffect(() => {
    setPoses(originalPosOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <main>
        <p
          style={{
            fontWeight: 'bold',
            fontSize: '3rem',
            marginBottom: '2rem',
            width: '100%'
          }}
        >
          {`Edit Definitions of "${word}"`}
        </p>
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
                type={pos}
                posIds={definitionIds[pos]}
                posObject={posObj[pos]}
                onListItemMove={params =>
                  handleDefinitionsMove({
                    ...params,
                    setIds: onSetDefinitionIds[pos],
                    ids: definitionIds[pos]
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
          Close
        </Button>
        <Button
          color="blue"
          disabled={disabled || posting}
          onClick={() => handleEditDone({ poses, definitionIds })}
        >
          Apply
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

  async function handleEditDone({ poses, definitionIds }) {
    setPosting(true);
    const definitions = [];
    for (let key in posObj) {
      for (let id of definitionIds[key]) {
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
