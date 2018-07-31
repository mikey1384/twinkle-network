import PropTypes from 'prop-types'
import React from 'react'
import Icon from 'components/Icon'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from 'constants/itemTypes'
import { Color } from 'constants/css'

const listItemSource = {
  beginDrag(props) {
    return {
      questionId: props.questionId
    }
  },
  isDragging(props, monitor) {
    return props.questionId === monitor.getItem().questionId
  }
}

const listItemTarget = {
  hover(targetProps, monitor) {
    const targetId = targetProps.questionId
    const sourceProps = monitor.getItem()
    const sourceId = sourceProps.questionId
    if (sourceId !== targetId) {
      targetProps.onMove({ sourceId, targetId })
    }
  }
}

QuestionsListItem.propTypes = {
  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  isDragging: PropTypes.bool,
  item: PropTypes.object,
  questionId: PropTypes.number
}
function QuestionsListItem({
  connectDragSource,
  connectDropTarget,
  isDragging,
  item,
  questionId
}) {
  return connectDragSource(
    connectDropTarget(
      <li
        style={{
          opacity: isDragging ? 0 : 1,
          color: (!item.title || item.deleted) && '#999',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'ns-resize'
        }}
      >
        <div>
          {item.title
            ? `${item.title} ${item.deleted ? '(removed)' : ''}`
            : `Untitled Question ${questionId + 1} ${
                item.deleted ? '(removed)' : ''
              }`}
        </div>
        <div>
          <Icon icon="align-justify" style={{ color: Color.gray() }} />
        </div>
      </li>
    )
  )
}

export default DropTarget(ItemTypes.LIST_ITEM, listItemTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(
  DragSource(ItemTypes.LIST_ITEM, listItemSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))(QuestionsListItem)
)
