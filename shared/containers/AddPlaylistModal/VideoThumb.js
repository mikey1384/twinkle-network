import React, { Component } from 'react';

class VideoThumb extends Component {
  render () {
    const { video } = this.props;
    return (
      <div
        className="col-sm-2"
        key={ video.id }
      >
        <div
          className={`thumbnail ${this.props.selected && 'thumbnail-selected'}`}
          style={{
            cursor: 'pointer'
          }}
          onClick={
            () => {
              if (this.props.selectable) {
                const selected = this.props.selected;
                if (selected) {
                  this.props.onDeselect(video.id);
                } else {
                  this.props.onSelect(video.id);
                }
              }
            }
          }
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
    )
  }
}

export default VideoThumb;
