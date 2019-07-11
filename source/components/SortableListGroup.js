import PropTypes from 'prop-types';
import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import SortableListItem from './SortableListItem';
import { borderRadius, Color } from 'constants/css';
import { css } from 'emotion';

SortableListGroup.propTypes = {
  listItems: PropTypes.array.isRequired,
  onMove: PropTypes.func.isRequired
};

export default function SortableListGroup({ listItems, onMove }) {
  return (
    <DndProvider backend={HTML5Backend}>
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
        {listItems.map((item, index) => {
          return (
            <SortableListItem
              key={index}
              index={index}
              item={item}
              onMove={onMove}
            />
          );
        })}
      </div>
    </DndProvider>
  );
}
