import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { limitBrs, processedStringWithURL } from 'helpers/stringHelpers';

LongText.propTypes = {
  children: PropTypes.string,
  className: PropTypes.string,
  cleanString: PropTypes.bool,
  maxLines: PropTypes.number,
  style: PropTypes.object,
  noExpand: PropTypes.bool
};

export default function LongText({
  style,
  className,
  cleanString,
  children,
  maxLines = 10,
  noExpand
}) {
  const [text, setText] = useState(children || '');
  const [fullText, setFullText] = useState(false);
  const [more, setMore] = useState(false);
  const ContainerRef = useRef(null);
  const TextRef = useRef(null);

  useEffect(() => {
    setFullText(false);
    setMore(false);
  }, [children]);

  useEffect(() => {
    if (ContainerRef.current?.clientWidth) {
      truncateText(children || '');
    }
  }, [children, ContainerRef.current?.clientWidth]);

  return (
    <div ref={ContainerRef} style={style} className={className}>
      <p ref={TextRef}>
        {fullText ? (
          <span
            dangerouslySetInnerHTML={{
              __html: limitBrs(
                cleanString ? children : processedStringWithURL(children || '')
              )
            }}
          />
        ) : (
          <>
            <span
              dangerouslySetInnerHTML={{
                __html: limitBrs(
                  cleanString ? text : processedStringWithURL(text)
                )
              }}
            />
            {more && (
              <>
                {'... '}
                {!noExpand && (
                  <a
                    style={{ cursor: 'pointer' }}
                    onClick={() => setFullText(true)}
                  >
                    Read More
                  </a>
                )}
              </>
            )}
          </>
        )}
      </p>
    </div>
  );

  function truncateText(originalText) {
    const maxWidth = TextRef.current.clientWidth;
    const canvas = document.createElement('canvas').getContext('2d');
    const computedStyle = window.getComputedStyle(ContainerRef.current);
    const font = `${computedStyle['font-weight']} ${
      computedStyle['font-style']
    } ${computedStyle['font-size']} ${computedStyle['font-family']}`;
    canvas.font = font;
    let line = '';
    let numLines = 0;
    let trimmedText = '';
    for (let i = 0; i < originalText.length; i++) {
      line += originalText[i];
      if (
        originalText[i] === '\n' ||
        canvas.measureText(line).width > maxWidth
      ) {
        numLines++;
        trimmedText += line;
        line = '';
      }
      if (numLines === maxLines && i < originalText.length - 1) {
        const remainingText = originalText.slice(i + 1);
        let more = true;
        if (
          remainingText[0] !== '\n' &&
          canvas.measureText(remainingText).width < maxWidth
        ) {
          trimmedText += remainingText;
          more = false;
        }
        setText(trimmedText);
        setMore(more);
        return;
      }
    }
    setText(trimmedText + line || line);
  }
}
