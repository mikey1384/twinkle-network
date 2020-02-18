import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { processedStringWithURL } from 'helpers/stringHelpers';
import { Color } from 'constants/css';

Spoiler.propTypes = {
  content: PropTypes.string,
  onSpoilerClick: PropTypes.func
};

export default function Spoiler({ content, onSpoilerClick }) {
  const [spoilerShown, setSpoilerShown] = useState(false);
  const [grayness, setGrayness] = useState(105);
  const displayedContent = useMemo(() => {
    if (content.startsWith('/spoiler ')) return content.substr(9);
    if (content.startsWith('/secret ')) return content.substr(8);
  }, [content]);

  return (
    <div>
      {spoilerShown ? (
        <span
          style={{
            background: Color.lighterGray(),
            borderRadius: '2px'
          }}
          dangerouslySetInnerHTML={{
            __html: processedStringWithURL(displayedContent)
          }}
        />
      ) : (
        <div
          style={{
            cursor: 'pointer',
            background: `rgb(${grayness},${grayness},${grayness})`,
            height: '2.5rem',
            width:
              displayedContent.length > 50
                ? '80%'
                : 0.8 * displayedContent.length + 'rem',
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
