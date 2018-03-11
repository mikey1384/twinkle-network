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
  endDrag(props) {
    props.onDrop()
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
  deleted: PropTypes.bool,
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
  deleted,
  isDragging,
  inputType,
  label,
  onSelect,
  placeholder
}) {
  return deleted ? renderListItem() : connectDragSource(connectDropTarget(renderListItem()))

  function renderListItem() {
    return (
      <nav
        style={{
          opacity: isDragging ? 0 : 1,
          cursor: !checkDisabled && 'ns-resize'
        }}
        className="unselectable"
      >
        <main>
          <section>
            <div style={{ width: '10%' }}>
              <span
                className="glyphicon glyphicon-align-justify"
                style={{ color: Color.menuGray() }}
              />
            </div>
            <div
              style={{
                width: '90%',
                color: !label && '#999'
              }}
            >
              {label || placeholder}
            </div>
          </section>
        </main>
        <aside>
          <input
            type="radio"
            onChange={onSelect}
            checked={checked}
            disabled={checkDisabled}
            style={{ cursor: !checkDisabled && 'pointer' }}
          />
        </aside>
      </nav>
    )
  }
}

export default DropTarget(ItemTypes.LIST_ITEM, ListItemTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(
  DragSource(ItemTypes.LIST_ITEM, ListItemSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))(ChoiceListItem)
)
