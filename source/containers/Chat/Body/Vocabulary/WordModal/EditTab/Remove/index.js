import React from 'react';
import PropTypes from 'prop-types';
import PartOfSpeechBlock from './PartOfSpeechBlock';

Remove.propTypes = {
  editedDefinitionOrder: PropTypes.object.isRequired,
  deletedDefIds: PropTypes.array.isRequired,
  onListItemClick: PropTypes.func.isRequired,
  poses: PropTypes.array.isRequired,
  posObj: PropTypes.object.isRequired
};

export default function Remove({
  editedDefinitionOrder,
  deletedDefIds,
  onListItemClick,
  poses,
  posObj
}) {
  return (
    <div>
      <div>
        {poses.map(pos => (
          <PartOfSpeechBlock
            key={pos}
            deletedDefIds={deletedDefIds}
            style={{ marginBottom: '1.5rem' }}
            type={pos}
            onListItemClick={onListItemClick}
            defIds={editedDefinitionOrder[pos]}
            posObject={posObj[pos]}
          />
        ))}
      </div>
    </div>
  );
}
