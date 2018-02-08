import PropTypes from 'prop-types'
import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from 'constants/itemTypes'
import { Color } from 'constants/css'

const listItemSource = {
  beginDrag(props) {
    return {
      id: props.item.id
    }
  },
  isDragging(props, monitor) {
    return props.item.id === monitor.getItem().id
  }
}

const listItemTarget = {
  hover(targetProps, monitor) {
    const targetId = targetProps.item.id
    const sourceProps = monitor.getItem()
    const sourceId = sourceProps.id

    if (sourceId !== targetId) {
      targetProps.onMove({ sourceId, targetId })
    }
  }
}

QuestionsListItem.propTypes = {
  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  isDragging: PropTypes.bool,
  item: PropTypes.object
}
function QuestionsListItem({
  connectDragSource,
  connectDropTarget,
  isDragging,
  item
}) {
  return connectDragSource(
    connectDropTarget(
      <li
        className="list-group-item"
        style={{
          opacity: isDragging ? 0 : 1,
          color: (!item.label || item.deleted) && '#999'
        }}
      >
        {item.label
          ? `${item.label} ${item.deleted ? '(removed)' : ''}`
          : `Untitled Question ${item.id + 1} ${
              item.deleted ? '(removed)' : ''
            }`}
        <span
          className="glyphicon glyphicon-align-justify pull-right"
          style={{ color: Color.gray }}
        />
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
