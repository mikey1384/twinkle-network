import React from 'react';
import PropTypes from 'prop-types';
import SortableListItem from 'components/SortableListItem';
import { borderRadius, Color } from 'constants/css';
import { css } from 'emotion';

PartOfSpeechBlock.propTypes = {
  type: PropTypes.string,
  onListItemMove: PropTypes.func.isRequired,
  posIds: PropTypes.array.isRequired,
  posObject: PropTypes.object.isRequired
};

export default function PartOfSpeechBlock({
  type,
  onListItemMove,
  posIds,
  posObject
}) {
  return posIds.length > 0 ? (
    <div>
      <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{type}</p>
      <div
        className={css`
          width: 100%;
          cursor: ns-resize;
          display: flex;
          flex-direction: column;
          nav {
            align-items: center;
            padding: 1rem;
            display: flex;
            justify-content: space-between;
            margin-bottom: -1px;
            border: 1px solid ${Color.borderGray()};
          }
          nav:first-of-type {
            border-top-left-radius: ${borderRadius};
            border-top-right-radius: ${borderRadius};
          }
          nav:last-child {
            border-bottom-left-radius: ${borderRadius};
            border-bottom-right-radius: ${borderRadius};
          }
        `}
      >
        {posIds.map((id, index) => {
          return (
            <SortableListItem
              numbered
              key={id}
              id={id}
              index={index}
              listItemId={id}
              listItemLabel={posObject[id]?.title}
              listItemType={type}
              onMove={onListItemMove}
            />
          );
        })}
      </div>
    </div>
  ) : null;
}
