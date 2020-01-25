import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

PosBlock.propTypes = {
  contentObj: PropTypes.object.isRequired,
  definitionIds: PropTypes.array.isRequired,
  deletedDefIds: PropTypes.array.isRequired,
  partOfSpeech: PropTypes.string.isRequired,
  style: PropTypes.object
};
export default function PosBlock({
  contentObj,
  definitionIds,
  deletedDefIds,
  partOfSpeech,
  style
}) {
  const filteredDefinitionIds = useMemo(
    () => definitionIds.filter(id => !deletedDefIds.includes(id)),
    [definitionIds, deletedDefIds]
  );
  return filteredDefinitionIds.length > 0 ? (
    <div style={style}>
      <p
        style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem'
        }}
      >
        {partOfSpeech}
      </p>
      {filteredDefinitionIds.map((definitionId, index) => (
        <div key={definitionId} style={{ fontSize: '1.7rem', lineHeight: 2 }}>
          {index + 1}. {contentObj[definitionId].title}
        </div>
      ))}
    </div>
  ) : null;
}
