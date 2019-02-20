import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import FullTextReveal from 'components/Texts/FullTextReveal';
import VideoThumbImage from 'components/VideoThumbImage';
import Embedly from 'components/Embedly';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { cleanString } from 'helpers/stringHelpers';
import { textIsOverflown } from 'helpers';
import { Color } from 'constants/css';

Selectable.propTypes = {
  item: PropTypes.object,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  onDeselect: PropTypes.func,
  type: PropTypes.string
};

export default function Selectable({
  item,
  selected,
  onSelect,
  onDeselect,
  type = 'video'
}) {
  const [onTitleHover, setOnTitleHover] = useState(false);
  const ThumbLabelRef = useRef();

  return (
    <ErrorBoundary
      style={{
        width: '16%',
        margin: '0.3%',
        cursor: 'pointer',
        boxShadow: `0 0 5px ${selected ? Color.gold() : Color.darkerGray()}`,
        border: selected && `0.5rem solid ${Color.gold()}`,
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
        onClick={() => {
          if (selected) {
            onDeselect(item.id);
          } else {
            onSelect(item);
          }
        }}
      >
        <div style={{ width: '100%' }}>
          {type === 'video' ? (
            <VideoThumbImage
              height="65%"
              videoId={item.id}
              difficulty={item.difficulty}
              src={`https://img.youtube.com/vi/${item.content}/mqdefault.jpg`}
            />
          ) : (
            <Embedly noLink imageOnly {...item} />
          )}
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
              {cleanString(item.title)}
            </p>
            <FullTextReveal
              show={onTitleHover}
              text={cleanString(item.title)}
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
            {item.uploader ? item.uploader.username : item.uploaderName}
          </p>
        </div>
      </div>
    </ErrorBoundary>
  );

  function onMouseOver() {
    if (textIsOverflown(ThumbLabelRef.current)) {
      setOnTitleHover(true);
    }
  }
}
