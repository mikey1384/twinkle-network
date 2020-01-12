import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { useDrag, useDrop } from 'react-dnd';
import ItemTypes from 'constants/itemTypes';
import { Color } from 'constants/css';

QuestionsListItem.propTypes = {
  item: PropTypes.object,
  onMove: PropTypes.func.isRequired,
  questionId: PropTypes.number
};

export default function QuestionsListItem({
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
    hover(item) {
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
    <nav
      ref={drag(drop(Draggable))}
      style={{
        background: '#fff',
        opacity,
        color: (!listItem.title || listItem.deleted) && Color.lighterGray,
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
    </nav>
  );
}
