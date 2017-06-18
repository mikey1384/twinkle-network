import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {DragSource, DropTarget} from 'react-dnd'
import ItemTypes from 'constants/itemTypes'
import {cleanString} from 'helpers/stringHelpers'
import FullTextReveal from 'components/FullTextReveal'
import {textIsOverflown} from 'helpers/domHelpers'

const thumbSource = {
  beginDrag(props) {
    return {
      id: props.video.id
    }
  },
  isDragging(props, monitor) {
    return props.video.id && (props.video.id === monitor.getItem().id)
  }
}

const thumbTarget = {
  hover(targetProps, monitor) {
    const targetId = targetProps.video.id
    const sourceProps = monitor.getItem()
    const sourceId = sourceProps.id

    if (sourceId !== targetId) {
      targetProps.onMove({sourceId, targetId})
    }
  }
}

@DragSource(ItemTypes.THUMB, thumbSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@DropTarget(ItemTypes.THUMB, thumbTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class SortableThumb extends Component {
  static propTypes = {
    video: PropTypes.object.isRequired,
    connectDragSource: PropTypes.func,
    connectDropTarget: PropTypes.func,
    isDragging: PropTypes.bool
  }

  constructor() {
    super()
    this.state = {
      onTitleHover: false
    }
    this.onMouseOver = this.onMouseOver.bind(this)
  }

  render() {
    const {connectDragSource, connectDropTarget, isDragging, video} = this.props
    const {onTitleHover} = this.state
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
            alt="Thumbnail"
            src={`http://img.youtube.com/vi/${video.content}/0.jpg`}
          />
          <div
            className="caption"
            style={{height: '8rem'}}
          >
            <div>
              <h5
                ref={ref => { this.thumbLabel = ref }}
                style={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  lineHeight: 'normal'
                }}
                onMouseOver={this.onMouseOver}
                onMouseLeave={() => this.setState({onTitleHover: false})}
              >
                {cleanString(video.title)}
              </h5>
              <FullTextReveal show={onTitleHover} text={cleanString(video.title)} />
            </div>
            <small style={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}>{video.uploaderName}</small>
          </div>
        </div>
      </div>
    ))
  }

  onMouseOver() {
    if (textIsOverflown(this.thumbLabel)) {
      this.setState({onTitleHover: true})
    }
  }
}
