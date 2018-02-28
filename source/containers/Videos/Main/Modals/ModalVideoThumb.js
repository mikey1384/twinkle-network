import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { cleanString } from 'helpers/stringHelpers'
import FullTextReveal from 'components/FullTextReveal'
import { textIsOverflown } from 'helpers/domHelpers'
import VideoThumbImage from 'components/VideoThumbImage'
import { Color } from 'constants/css'

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
    const { video, selected, onSelect, onDeselect } = this.props
    const { onTitleHover } = this.state
    return (
      <div
        style={{
          width: '16%',
          margin: '0.3%',
          cursor: 'pointer'
        }}
      >
        <div
          style={{
            border: selected && `0.5rem solid ${Color.gold()}`,
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}
          onClick={() => {
            if (selected) {
              onDeselect(video.id)
            } else {
              onSelect(video)
            }
          }}
        >
          <div style={{ width: '100%' }}>
            <VideoThumbImage
              height="65%"
              videoId={video.id}
              isStarred={!!video.isStarred}
              src={`https://img.youtube.com/vi/${video.content}/mqdefault.jpg`}
            />
          </div>
          <div
            style={{
              height: '8rem',
              width: '100%'
            }}
          >
            <div>
              <p
                ref={ref => {
                  this.thumbLabel = ref
                }}
                style={{
                  marginTop: '1rem',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  lineHeight: 'normal'
                }}
                onMouseOver={this.onMouseOver}
                onMouseLeave={() => this.setState({ onTitleHover: false })}
              >
                {cleanString(video.title)}
              </p>
              <FullTextReveal
                show={onTitleHover}
                text={cleanString(video.title)}
              />
            </div>
            <small
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}
            >
              {video.uploaderName}
            </small>
          </div>
        </div>
      </div>
    )
  }

  onMouseOver() {
    if (textIsOverflown(this.thumbLabel)) {
      this.setState({ onTitleHover: true })
    }
  }
}
