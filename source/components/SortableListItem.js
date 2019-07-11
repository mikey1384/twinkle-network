import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import ItemTypes from 'constants/itemTypes';
import Icon from 'components/Icon';
import { useDrag, useDrop } from 'react-dnd';
import { cleanString } from 'helpers/stringHelpers';
import { Color } from 'constants/css';

SortableListItem.propTypes = {
  index: PropTypes.number,
  id: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  onMove: PropTypes.func.isRequired
};

export default function SortableListItem({ id, label, index, onMove }) {
  const Draggable = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.LIST_ITEM, id },
    isDragging: monitor => id === monitor.getItem().id
  });
  const [, drop] = useDrop({
    accept: ItemTypes.LIST_ITEM,
    hover(item, monitor) {
      if (!Draggable.current) {
        return;
      }
      if (item.id !== id) {
        onMove({ sourceId: item.id, targetId: id });
      }
    }
  });

  return (
    <nav
      ref={drag(drop(Draggable))}
      style={{
        opacity: isDragging ? 0.5 : 1,
        borderTop: index === 0 && `1px solid ${Color.borderGray()}`,
        color: Color.darkerGray()
      }}
    >
      <section>{cleanString(label)}</section>
      <Icon icon="align-justify" style={{ color: Color.darkerBorderGray() }} />
    </nav>
  );
}
