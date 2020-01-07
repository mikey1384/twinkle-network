import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import ItemTypes from 'constants/itemTypes';
import Icon from 'components/Icon';
import { useDrag, useDrop } from 'react-dnd';
import { cleanString } from 'helpers/stringHelpers';
import { Color } from 'constants/css';

SortableListItem.propTypes = {
  index: PropTypes.number,
  listItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  listItemLabel: PropTypes.string,
  numbered: PropTypes.bool,
  onMove: PropTypes.func.isRequired,
  listItemType: PropTypes.string
};

export default function SortableListItem({
  index,
  listItemId,
  listItemLabel,
  listItemType,
  numbered,
  onMove
}) {
  const Draggable = useRef(null);
  const [{ opacity }, drag] = useDrag({
    item: {
      type: ItemTypes.LIST_ITEM,
      id: listItemId,
      index,
      itemType: listItemType
    },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0 : 1
    })
  });
  const [, drop] = useDrop({
    accept: ItemTypes.LIST_ITEM,
    hover(item) {
      if (!Draggable.current) {
        return;
      }
      if (item.id === listItemId) {
        return;
      }
      if (listItemType && item.itemType !== listItemType) {
        return;
      }
      onMove({ sourceId: item.id, targetId: listItemId });
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
      <section>
        {numbered ? `${index + 1}. ` : ''}
        {cleanString(listItemLabel)}
      </section>
      <Icon icon="align-justify" style={{ color: Color.darkerBorderGray() }} />
    </nav>
  );
}
