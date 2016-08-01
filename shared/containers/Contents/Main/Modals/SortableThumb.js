import React, {Component, PropTypes} from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from 'constants/itemTypes';

const thumbSource = {
  beginDrag(props) {
    return {
      id: props.video.id
    };
  },
  isDragging(props, monitor) {
    return props.video.id && (props.video.id === monitor.getItem().id);
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
  static propTypes = {
    video: PropTypes.object.isRequired
  }

  render () {
    const {connectDragSource, connectDropTarget, isDragging, video} = this.props;
    return connectDragSource(connectDropTarget(
      <div
        className="col-sm-2"
        key={video.id}
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
            src={`http://img.youtube.com/vi/${video.videoCode}/0.jpg`}
          />
          <div className="caption">
            <div>
              <h5 style={{
                whiteSpace: 'nowrap',
                textOverflow:'ellipsis',
                overflow:'hidden',
                lineHeight: 'normal'
              }}>{video.title}</h5>
            </div>
            <small style={{
              whiteSpace: 'nowrap',
              textOverflow:'ellipsis',
              overflow:'hidden'
            }}>{video.uploaderName}</small>
          </div>
        </div>
      </div>
    ))
  }
}
