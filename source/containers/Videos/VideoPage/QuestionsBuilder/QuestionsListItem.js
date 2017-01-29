import React, {Component, PropTypes} from 'react'
import {DragSource, DropTarget} from 'react-dnd'
import ItemTypes from 'constants/itemTypes'

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
      targetProps.onMove({sourceId, targetId})
    }
  }
}

@DragSource(ItemTypes.LIST_ITEM, listItemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@DropTarget(ItemTypes.LIST_ITEM, listItemTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class QuestionsListItem extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func,
    connectDropTarget: PropTypes.func,
    isDragging: PropTypes.bool,
    item: PropTypes.object
  }
  render() {
    const {connectDragSource, connectDropTarget, isDragging} = this.props
    return connectDragSource(connectDropTarget(
      <li
        className="list-group-item"
        style={{
          opacity: isDragging ? 0 : 1,
          color: (!this.props.item.label || this.props.item.deleted) && '#999'
        }}
      >
        {this.props.item.label ?
          `${this.props.item.label} ${this.props.item.deleted ? '(removed)' : ''}`
          :
          `Untitled Question ${this.props.item.id + 1} ${this.props.item.deleted ? '(removed)' : ''}`
        }
        <span className="glyphicon glyphicon-align-justify pull-right grey-color"></span>
      </li>
    ))
  }
}
