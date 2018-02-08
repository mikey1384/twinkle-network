import PropTypes from 'prop-types'
import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from 'constants/itemTypes'
import { Color } from 'constants/css'

const ListItemSource = {
  beginDrag(props) {
    return {
      id: props.id,
      questionIndex: props.questionIndex
    }
  },
  isDragging(props, monitor) {
    return (
      props.id === monitor.getItem().id &&
      props.questionIndex === monitor.getItem().questionIndex
    )
  },
  endDrag(props, monitor) {
    const item = monitor.getItem()
    if (props.id !== item.id && props.questionIndex === item.questionIndex) {
      props.onDrop()
    }
  }
}

const ListItemTarget = {
  hover(targetProps, monitor) {
    const targetId = targetProps.id
    const sourceProps = monitor.getItem()
    const sourceId = sourceProps.id

    const targetQuestionIndex = targetProps.questionIndex
    const sourceQuestionIndex = sourceProps.questionIndex

    if (targetQuestionIndex === sourceQuestionIndex && sourceId !== targetId) {
      targetProps.onMove({ sourceId, targetId })
    }
  }
}

ChoiceListItem.propTypes = {
  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  isDragging: PropTypes.bool,
  inputType: PropTypes.string,
  onSelect: PropTypes.func,
  checked: PropTypes.bool,
  checkDisabled: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string
}
function ChoiceListItem({
  checked,
  checkDisabled,
  connectDragSource,
  connectDropTarget,
  isDragging,
  inputType,
  label,
  onSelect,
  placeholder
}) {
  return connectDragSource(
    connectDropTarget(
      <div
        className="list-group-item container-fluid"
        style={{
          opacity: isDragging ? 0 : 1,
          cursor: !checkDisabled && 'ns-resize'
        }}
      >
        <span
          className="glyphicon glyphicon-align-justify pull-left col-sm-1"
          style={{ paddingLeft: '0px', color: Color.menuGray }}
        />
        <span
          className="col-sm-10"
          style={{
            paddingLeft: '0px',
            color: !label && '#999'
          }}
          dangerouslySetInnerHTML={{ __html: label || placeholder }}
        />
        <span className="input pull-right">
          <input
            type={inputType}
            onChange={onSelect}
            checked={checked}
            disabled={checkDisabled}
            style={{ cursor: !checkDisabled && 'pointer' }}
          />
        </span>
      </div>
    )
  )
}

export default DropTarget(ItemTypes.LIST_ITEM, ListItemTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(
  DragSource(ItemTypes.LIST_ITEM, ListItemSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))(ChoiceListItem)
)
