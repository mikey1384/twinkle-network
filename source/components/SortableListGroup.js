import PropTypes from 'prop-types';
import React from 'react';
import HTML5Backend from 'react-dnd-html5-touch-backend';
import SortableListItem from './SortableListItem';
import { DragDropContext } from 'react-dnd';
import { borderRadius, Color } from 'constants/css';
import { css } from 'emotion';

SortableListGroup.propTypes = {
  listItems: PropTypes.array.isRequired,
  onMove: PropTypes.func.isRequired
};

function SortableListGroup({ listItems, onMove }) {
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
  );
}

export default DragDropContext(HTML5Backend)(SortableListGroup);
