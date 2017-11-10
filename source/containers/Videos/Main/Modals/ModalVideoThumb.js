import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {cleanString} from 'helpers/stringHelpers'
import FullTextReveal from 'components/FullTextReveal'
import {textIsOverflown} from 'helpers/domHelpers'
import StarMark from 'components/StarMark'

export default class VideoThumb extends Component {
  static propTypes = {
    video: PropTypes.object,
    selected: PropTypes.bool,
    onSelect: PropTypes.func,
    onDeselect: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      onTitleHover: false
    }
    this.onMouseOver = this.onMouseOver.bind(this)
  }

  render() {
    const {video, selected, onSelect, onDeselect} = this.props
    const {onTitleHover} = this.state
    return (
      <div
        className="col-xs-2"
      >
        <div
          className={`thumbnail ${selected && 'thumbnail-selected'}`}
          style={{cursor: 'pointer'}}
          onClick={() => {
            if (selected) {
              onDeselect(video.id)
            } else {
              onSelect(video)
            }
          }}
        >
          <div
            style={{
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
            {video.isStarred && <StarMark size={2} />}
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
              >{cleanString(video.title)}</h5>
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
    )
  }

  onMouseOver() {
    if (textIsOverflown(this.thumbLabel)) {
      this.setState({onTitleHover: true})
    }
  }
}
