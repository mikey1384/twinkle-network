import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import FullTextReveal from 'components/Texts/FullTextReveal';
import VideoThumbImage from 'components/VideoThumbImage';
import Embedly from 'components/Embedly';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { cleanString } from 'helpers/stringHelpers';
import { textIsOverflown } from 'helpers';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { useMyState } from 'helpers/hooks';

Selectable.propTypes = {
  item: PropTypes.object,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  onDeselect: PropTypes.func,
  contentType: PropTypes.string
};

export default function Selectable({
  contentType = 'video',
  item = {},
  onSelect,
  onDeselect,
  selected
}) {
  const { profileTheme } = useMyState();
  const [onTitleHover, setOnTitleHover] = useState(false);
  const ThumbLabelRef = useRef(null);

  return (
    <ErrorBoundary
      className={`unselectable ${css`
        width: 16%;
        @media (max-width: ${mobileMaxWidth}) {
          width: 32%;
        }
      `}`}
      style={{
        margin: '0.3%',
        cursor: 'pointer',
        boxShadow: `0 0 5px ${
          selected ? Color[profileTheme]() : Color.darkerGray()
        }`,
        border: selected && `0.5rem solid ${Color[profileTheme]()}`,
        background: Color.whiteGray()
      }}
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
            onSelect(item.id);
          }
        }}
      >
        <div style={{ width: '100%' }}>
          {contentType === 'video' ? (
            <VideoThumbImage
              height="65%"
              videoId={item.id}
              rewardLevel={item.rewardLevel}
              src={`https://img.youtube.com/vi/${item.content}/mqdefault.jpg`}
            />
          ) : (
            <Embedly noLink imageOnly contentId={item.id} />
          )}
        </div>
        <div
          style={{
            height: '8rem',
            width: '100%',
            padding: '0 1rem'
          }}
        >
          <div
            onMouseOver={onMouseOver}
            onMouseLeave={() => setOnTitleHover(false)}
          >
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
