import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import ItemTypes from 'constants/itemTypes';
import Icon from 'components/Icon';
import { useDrag, useDrop } from 'react-dnd';
import { cleanString } from 'helpers/stringHelpers';
import { Color } from 'constants/css';

SortableListItem.propTypes = {
  index: PropTypes.number,
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired,
  onMove: PropTypes.func.isRequired
};

export default function SortableListItem({ index, item: listItem, onMove }) {
  const Draggable = useRef(null);
  const [{ opacity }, drag] = useDrag({
    item: { type: ItemTypes.THUMB, id: listItem.id, index },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0 : 1
    })
  });
  const [, drop] = useDrop({
    accept: ItemTypes.THUMB,
    hover(item) {
      if (!Draggable.current) {
        return;
      }
      if (item.id === listItem.id) {
        return;
      }
      onMove({ sourceId: item.id, targetId: listItem.id });
    }
  });

  return (
    <nav
      ref={drag(drop(Draggable))}
      style={{
        opacity,
        borderTop: index === 0 && `1px solid ${Color.borderGray()}`,
        color: Color.darkerGray()
      }}
    >
      <section>{cleanString(listItem.title)}</section>
      <Icon icon="align-justify" style={{ color: Color.darkerBorderGray() }} />
    </nav>
  );
}
