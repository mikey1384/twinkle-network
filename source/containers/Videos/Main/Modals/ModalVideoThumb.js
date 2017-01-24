import React from 'react';

export default function VideoThumb({video, selected, onSelect, onDeselect}) {
  return (
    <div
      className="col-xs-2"
    >
      <div
        className={`thumbnail ${selected && 'thumbnail-selected'}`}
        style={{cursor: 'pointer'}}
        onClick={() => {
          if (selected) {
            onDeselect(video.id);
          } else {
            onSelect(video.id);
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
            src={`http://img.youtube.com/vi/${video.videoCode}/0.jpg`}
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
        </div>
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
  )
}
