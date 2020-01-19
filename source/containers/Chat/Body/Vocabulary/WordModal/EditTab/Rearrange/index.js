import React from 'react';
import PropTypes from 'prop-types';
import PartOfSpeechBlock from './PartOfSpeechBlock';
import PartOfSpeechesList from './PartOfSpeechesList';

Rearrange.propTypes = {
  definitionIds: PropTypes.object.isRequired,
  onSetDefinitionIds: PropTypes.func.isRequired,
  onSetPoses: PropTypes.func.isRequired,
  poses: PropTypes.array.isRequired,
  posObj: PropTypes.object.isRequired
};

export default function Rearrange({
  definitionIds,
  onSetDefinitionIds,
  onSetPoses,
  poses,
  posObj
}) {
  return (
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
    onSetPoses(newPoses);
  }
}
