import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { useDrag, useDrop } from 'react-dnd';
import ItemTypes from 'constants/itemTypes';
import { Color } from 'constants/css';

QuestionsListItem.propTypes = {
  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  isDragging: PropTypes.bool,
  item: PropTypes.object,
  onMove: PropTypes.func.isRequired,
  questionId: PropTypes.number
};

export default function QuestionsListItem({
  connectDragSource,
  connectDropTarget,
  isDragging,
  item: listItem,
  onMove,
  questionId
}) {
  const Draggable = useRef(null);
  const [{ opacity }, drag] = useDrag({
    item: { type: ItemTypes.LIST_ITEM, questionId: questionId },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0 : 1
    })
  });
  const [, drop] = useDrop({
    accept: ItemTypes.LIST_ITEM,
    hover(item, monitor) {
      if (!Draggable.current) {
        return;
      }
      if (item.questionId === questionId) {
        return;
      }
      onMove({ sourceId: item.questionId, targetId: questionId });
    }
  });

  return (
    <li
      ref={drag(drop(Draggable))}
      style={{
        background: '#fff',
        opacity,
        color: (!listItem.title || listItem.deleted) && Color.lightGray,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'ns-resize'
      }}
    >
      <div>
        {listItem.title
          ? `${listItem.title} ${listItem.deleted ? '(removed)' : ''}`
          : `Untitled Question ${questionId + 1} ${
              listItem.deleted ? '(removed)' : ''
            }`}
      </div>
      <div>
        <Icon icon="align-justify" style={{ color: Color.gray() }} />
      </div>
    </li>
  );
}
