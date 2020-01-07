import React from 'react';
import PropTypes from 'prop-types';
import SortableListItem from 'components/SortableListItem';
import { css } from 'emotion';
import { borderRadius, Color } from 'constants/css';

PartOfSpeechesList.propTypes = {
  partOfSpeeches: PropTypes.array.isRequired
};

export default function PartOfSpeechesList({ partOfSpeeches }) {
  return (
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
      {partOfSpeeches.map((pos, index) => {
        return (
          <SortableListItem
            numbered
            key={pos}
            id={pos}
            index={index}
            listItemId={pos}
            listItemLabel={pos}
            onMove={() => console.log('move')}
          />
        );
      })}
    </div>
  );
}
