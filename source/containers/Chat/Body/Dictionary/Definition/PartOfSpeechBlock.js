import React from 'react';
import PropTypes from 'prop-types';
import SortableListGroup from 'components/SortableListGroup';

PartOfSpeechBlock.propTypes = {
  partOfSpeech: PropTypes.string,
  posIds: PropTypes.array.isRequired,
  posObject: PropTypes.object.isRequired,
  onListItemMove: PropTypes.func.isRequired
};

export default function PartOfSpeechBlock({
  onListItemMove,
  partOfSpeech,
  posIds,
  posObject
}) {
  return posIds.length > 0 ? (
    <div>
      <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>Noun</p>
      <SortableListGroup
        numbered
        style={{ marginTop: '1rem' }}
        listItemObj={posObject}
        onMove={params => onListItemMove({ ...params, partOfSpeech })}
        itemIds={posIds}
      />
    </div>
  ) : null;
}
