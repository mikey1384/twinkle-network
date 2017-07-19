import PropTypes from 'prop-types'
import React from 'react'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-touch-backend'
import SortableListItem from './SortableListItem'

SortableListGroup.propTypes = {
  listItems: PropTypes.array.isRequired,
  onMove: PropTypes.func.isRequired
}
function SortableListGroup({listItems, onMove}) {
  return (
    <ul
      className="list-group unselectable"
      style={{cursor: 'ns-resize'}}
    >
      {listItems.map((item, index) => {
        return (
          <SortableListItem
            key={index}
            item={item}
            onMove={onMove}
          />
        )
      })}
    </ul>
  )
}

export default DragDropContext(HTML5Backend)(SortableListGroup)
