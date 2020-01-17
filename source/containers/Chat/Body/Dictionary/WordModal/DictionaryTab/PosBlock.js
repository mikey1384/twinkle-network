import React from 'react';
import PropTypes from 'prop-types';

PosBlock.propTypes = {
  contentObj: PropTypes.object.isRequired,
  definitionIds: PropTypes.array.isRequired,
  partOfSpeech: PropTypes.string.isRequired,
  style: PropTypes.object
};
export default function PosBlock({
  contentObj,
  definitionIds,
  partOfSpeech,
  style
}) {
  return (
    <div style={style}>
      <p
        style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}
      >
        {partOfSpeech}
      </p>
      {definitionIds.map((definitionId, index) => (
        <div key={definitionId}>
          {index + 1}. {contentObj[definitionId].title}
        </div>
      ))}
    </div>
  );
}
