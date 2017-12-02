import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {DragSource, DropTarget} from 'react-dnd'
import ItemTypes from 'constants/itemTypes'
import {cleanString} from 'helpers/stringHelpers'
import FullTextReveal from 'components/FullTextReveal'
import {textIsOverflown} from 'helpers/domHelpers'
import StarMark from 'components/StarMark'

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

class SortableThumb extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    video: PropTypes.object.isRequired
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
        <div className="thumbnail">
          <div
            style={{
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              paddingBottom: '75%'
            }}
          >
            <img
              alt="Thumbnail"
              src={`http://img.youtube.com/vi/${video.content}/0.jpg`}
              style={{
                width: '100%',
                position: 'absolute',
                top: '0px',
                left: '0px',
                bottom: '0px',
                right: '0px',
                margin: 'auto'
              }}
            />
            {!!video.isStarred && <StarMark size={2} />}
          </div>
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

export default DropTarget(ItemTypes.THUMB, thumbTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))(
  DragSource(ItemTypes.THUMB, thumbSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))(SortableThumb)
)
