import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { processedStringWithURL } from 'helpers/stringHelpers';
import { Color } from 'constants/css';

Spoiler.propTypes = {
  content: PropTypes.string,
  onSpoilerClick: PropTypes.func
};

export default function Spoiler({ content, onSpoilerClick }) {
  let [spoilerShown, setSpoilerShown] = useState(false);
  let [grayness, setGrayness] = useState(105);
  return (
    <div>
      {spoilerShown ? (
        <span
          style={{
            background: Color.lighterGray(),
            borderRadius: '2px'
          }}
          dangerouslySetInnerHTML={{
            __html: processedStringWithURL(content.substr(9))
          }}
        />
      ) : (
        <div
          style={{
            cursor: 'pointer',
            background: `rgb(${grayness},${grayness},${grayness})`,
            height: '2.1rem',
            width:
              content.substr(9).length > 100
                ? '40rem'
                : 0.8 * content.substr(9).length + 'rem',
            borderRadius: '5px'
          }}
          onClick={handleSpoilerClick}
          onMouseEnter={() => setGrayness(128)}
          onMouseLeave={() => setGrayness(105)}
        />
      )}
    </div>
  );

  function handleSpoilerClick() {
    setSpoilerShown(true);
    onSpoilerClick();
  }
}
