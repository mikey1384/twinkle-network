import React, { Component } from 'react';

class VideoThumb extends Component {
  render () {
    const { video, selected, selectable, onSelect, onDeselect } = this.props;
    return (
      <div
        className="col-sm-2"
      >
        <div
          className={`thumbnail ${selected && 'thumbnail-selected'}`}
          style={{
            cursor: 'pointer'
          }}
          onClick={
            () => {
              if (selectable) {
                const selected = this.props.selected;
                if (selected) {
                  onDeselect(video.id);
                } else {
                  onSelect(video.id);
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
            }}>{video.uploadername}</small>
          </div>
        </div>
      </div>
    )
  }
}

export default VideoThumb;
