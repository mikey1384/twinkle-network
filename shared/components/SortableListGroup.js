import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend'
import SortableListItem from './SortableListItem';

@DragDropContext(HTML5Backend)
export default class SortableListGroup extends Component {
  render() {
    return (
      <ul
        className="list-group unselectable"
        style={{cursor: 'ns-resize'}}
      >
        {
          this.props.listItems.map((item, index) => {
            return (
              <SortableListItem
                key={index}
                item={item}
                onMove={this.props.onMove}
              />
            )
          })
        }
      </ul>
    )
  }
}
