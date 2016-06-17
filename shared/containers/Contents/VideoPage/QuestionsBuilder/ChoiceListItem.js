import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import ItemTypes from 'constants/itemTypes';

const ListItemSource = {
  beginDrag(props) {
    return {
      id: props.id,
      questionIndex: props.questionIndex
    };
  },
  isDragging(props, monitor) {
    return props.id === monitor.getItem().id && props.questionIndex === monitor.getItem().questionIndex;
  },
  endDrag(props, monitor) {
    const item = monitor.getItem();
    if (props.id !== monitor.getItem().id && props.questionIndex === monitor.getItem().questionIndex) {
      props.onDrop();
    }
  }
};

const ListItemTarget = {
  hover(targetProps, monitor) {
    const targetId = targetProps.id;
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    const targetQuestionIndex = targetProps.questionIndex;
    const sourceQuestionIndex = sourceProps.questionIndex;

    if(targetQuestionIndex === sourceQuestionIndex && sourceId !== targetId) {
      targetProps.onMove({sourceId, targetId});
    }
  }
};

@DragSource(ItemTypes.LIST_ITEM, ListItemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@DropTarget(ItemTypes.LIST_ITEM, ListItemTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class ChoiceListItem extends Component {
  render() {
    const {connectDragSource, connectDropTarget, isDragging, inputType, onSelect, checked, checkDisabled} = this.props;
    return connectDragSource(connectDropTarget(
      <div
        className="list-group-item container-fluid"
        style={{
          opacity: isDragging ? 0 : 1,
          cursor: !checkDisabled && 'ns-resize'
        }}
      >
        <span className="glyphicon glyphicon-align-justify pull-left grey-color col-sm-1"
          style={{paddingLeft: '0px'}}
        ></span>
        <span
          className="col-sm-10"
          style={{
            paddingLeft: '0px',
            color: !this.props.label && '#999'
          }}
          dangerouslySetInnerHTML={{__html: this.props.label || this.props.placeholder}}
        />
        <span className="input pull-right"
        >
          <input
            type={inputType}
            onChange={onSelect}
            checked={checked}
            disabled={checkDisabled}
            style={{cursor: !checkDisabled && 'pointer'}}
          />
        </span>
      </div>
    ))
  }
}
