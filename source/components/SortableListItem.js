import PropTypes from 'prop-types'
import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from 'constants/itemTypes'
import { cleanString } from 'helpers/stringHelpers'
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

SortableListItem.propTypes = {
  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  isDragging: PropTypes.bool,
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired
  }).isRequired
}
function SortableListItem({
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
          opacity: isDragging ? 0 : 1
        }}
      >
        {cleanString(item.label)}
        <span
          className="glyphicon glyphicon-align-justify pull-right"
          style={{ color: Color.menuGray }}
        />
      </li>
    )
  )
}

export default DragSource(
  ItemTypes.LIST_ITEM,
  listItemSource,
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(
  DropTarget(ItemTypes.LIST_ITEM, listItemTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  }))(SortableListItem)
)
