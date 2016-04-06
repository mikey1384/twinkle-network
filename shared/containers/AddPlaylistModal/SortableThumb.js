import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import ItemTypes from 'component_constants/itemTypes';

const thumbSource = {
  beginDrag(props) {
    return {
      id: props.video.id
    };
  },
  endDrag(props, monitor) {
    if(!monitor.didDrop()) {
      return;
    }
  },
  isDragging(props, monitor) {
    return props.video.id === monitor.getItem().id;
  }
};

const thumbTarget = {
  hover(targetProps, monitor) {
    const targetId = targetProps.video.id;
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    if(sourceId !== targetId) {
      targetProps.onMove({sourceId, targetId});
    }
  }
};

@DragSource(ItemTypes.THUMB, thumbSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@DropTarget(ItemTypes.THUMB, thumbTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class SortableThumb extends Component {
  render () {
    const { connectDragSource, connectDropTarget, isDragging, video } = this.props;
    return connectDragSource(connectDropTarget(
      <div
        className="col-sm-2"
        key={ video.id }
        style={{
          opacity: isDragging ? 0.5 : 1
        }}
      >
        <div
          className="thumbnail"
          style={{
            cursor: 'pointer'
          }}
        >
          <img
            src={`http://img.youtube.com/vi/${video.videocode}/0.jpg`}
          />
          <div className="caption">
            <div>
              <h4 style={{
                whiteSpace: 'nowrap',
                textOverflow:'ellipsis',
                overflow:'hidden',
                lineHeight: 'normal'
              }}>{video.title}</h4>
            </div>
            <small style={{
              whiteSpace: 'nowrap',
              textOverflow:'ellipsis',
              overflow:'hidden'
            }}>{video.uploadername}</small>
          </div>
        </div>
      </div>
    ))
  }
}
