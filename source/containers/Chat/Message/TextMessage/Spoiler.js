import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { processedStringWithURL } from 'helpers/stringHelpers';
import { Color } from 'constants/css';

Spoiler.propTypes = {
  isNotification: PropTypes.bool,
  content: PropTypes.string
};

export default function Spoiler({ isNotification, content }) {
  let [spoilerShown, setSpoilerShown] = useState(false);
  let [grayness, setGrayness] = useState(105);
  return (
    <div>
      {spoilerShown ? (
        <span
          style={{
            color: isNotification ? Color.gray() : undefined,
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
            background: `rgb(${grayness},${grayness},${grayness})`,
            height: '2rem',
            width:
              content.substr(9).length > 100
                ? '80rem'
                : 0.8 * content.substr(9).length + 'rem',
            borderRadius: '5px'
          }}
          onClick={() => setSpoilerShown(true)}
          onMouseEnter={() => setGrayness(128)}
          onMouseLeave={() => setGrayness(105)}
        ></div>
      )}
    </div>
  );
}