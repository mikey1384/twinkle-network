import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import ItemTypes from 'constants/itemTypes';
import FullTextReveal from 'components/Texts/FullTextReveal';
import VideoThumbImage from 'components/VideoThumbImage';
import { cleanString } from 'helpers/stringHelpers';
import { textIsOverflown } from 'helpers';
import { DragSource, DropTarget } from 'react-dnd';
import { Color } from 'constants/css';

const thumbSource = {
  beginDrag(props) {
    return {
      id: props.video.id
    };
  },
  isDragging(props, monitor) {
    return props.video.id && props.video.id === monitor.getItem().id;
  }
};

const thumbTarget = {
  hover(targetProps, monitor) {
    const targetId = targetProps.video.id;
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    if (sourceId !== targetId) {
      targetProps.onMove({ sourceId, targetId });
    }
  }
};

SortableThumb.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  video: PropTypes.object.isRequired
};

function SortableThumb({
  connectDragSource,
  connectDropTarget,
  isDragging,
  video
}) {
  const [onTitleHover, setOnTitleHover] = useState(false);
  const ThumbLabelRef = useRef(null);
  return connectDragSource(
    connectDropTarget(
      <div
        key={video.id}
        style={{
          opacity: isDragging ? 0.5 : 1,
          width: '16%',
          margin: '0.3%',
          cursor: 'pointer',
          boxShadow: `0 0 5px ${Color.darkerGray()}`,
          background: Color.whiteGray()
        }}
        className="unselectable"
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}
        >
          <div style={{ width: '100%' }}>
            <VideoThumbImage
              height="65%"
              videoId={video.id}
              difficulty={video.difficulty}
              src={`https://img.youtube.com/vi/${video.content}/mqdefault.jpg`}
            />
          </div>
          <div
            style={{
              height: '8rem',
              width: '100%',
              padding: '0 1rem'
            }}
          >
            <div>
              <p
                ref={ThumbLabelRef}
                style={{
                  marginTop: '1rem',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  lineHeight: 'normal'
                }}
                onMouseOver={onMouseOver}
                onMouseLeave={() => setOnTitleHover(false)}
              >
                {cleanString(video.title)}
              </p>
              <FullTextReveal
                show={onTitleHover}
                text={cleanString(video.title)}
              />
            </div>
            <p
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                fontSize: '1.3rem',
                lineHeight: 2
              }}
            >
              {video.uploaderName}
            </p>
          </div>
        </div>
      </div>
    )
  );

  function onMouseOver() {
    if (textIsOverflown(ThumbLabelRef.current)) {
      setOnTitleHover(true);
    }
  }
}

export default DropTarget(ItemTypes.THUMB, thumbTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(
  DragSource(ItemTypes.THUMB, thumbSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))(SortableThumb)
);
