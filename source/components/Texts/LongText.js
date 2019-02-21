import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { limitBrs, processedStringWithURL } from 'helpers/stringHelpers';
import { connect } from 'react-redux';

LongText.propTypes = {
  chatMode: PropTypes.bool,
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
  cleanString: PropTypes.bool,
  maxLines: PropTypes.number,
  searchMode: PropTypes.bool,
  style: PropTypes.object,
  noExpand: PropTypes.bool
};

function LongText({
  chatMode,
  style,
  className,
  cleanString,
  children = '',
  maxLines = 10,
  noExpand,
  searchMode
}) {
  const [text, setText] = useState(processedStringWithURL(children));
  const [more, setMore] = useState(false);
  const [fullText, setFullText] = useState(false);
  const ContainerRef = useRef();
  const TextRef = useRef();

  useEffect(() => {
    setMore(false);
    if (!chatMode && !searchMode) {
      truncateText(children || '');
    }
  }, [children, ContainerRef.current?.clientWidth, chatMode, searchMode]);

  useEffect(() => {
    setFullText(false);
  }, [children]);

  return (
    <div ref={ContainerRef} style={style} className={className}>
      <p ref={TextRef}>
        {fullText ? (
          <span
            dangerouslySetInnerHTML={{
              __html: limitBrs(
                cleanString ? children : processedStringWithURL(children)
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

export default connect(state => ({
  chatMode: state.ChatReducer.chatMode,
  searchMode: state.SearchReducer.searchMode
}))(LongText);
