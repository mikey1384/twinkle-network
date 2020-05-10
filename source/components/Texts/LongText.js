import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { limitBrs, processedStringWithURL } from 'helpers/stringHelpers';
import { Color } from 'constants/css';

LongText.propTypes = {
  children: PropTypes.string,
  className: PropTypes.string,
  cleanString: PropTypes.bool,
  maxLines: PropTypes.number,
  style: PropTypes.object,
  readMoreColor: PropTypes.string
};

export default function LongText({
  style,
  className,
  cleanString,
  children: text,
  maxLines = 10,
  readMoreColor = Color.blue()
}) {
  const ContainerRef = useRef(null);
  const [fullText, setFullText] = useState(false);
  const [isOverflown, setIsOverflown] = useState(false);

  useEffect(() => {
    if (
      ContainerRef.current?.scrollHeight > ContainerRef.current?.clientHeight
    ) {
      setIsOverflown(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContainerRef.current]);

  return (
    <div style={style} className={className}>
      <p>
        {fullText ? (
          <span
            dangerouslySetInnerHTML={{
              __html: limitBrs(
                cleanString ? text : processedStringWithURL(text || '')
              )
            }}
          />
        ) : (
          <>
            <span
              ref={ContainerRef}
              style={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: maxLines,
                WebkitBoxOrient: 'vertical'
              }}
              dangerouslySetInnerHTML={{
                __html: limitBrs(
                  cleanString ? text : processedStringWithURL(text)
                )
              }}
            />
            <>
              {isOverflown && (
                <>
                  <a
                    style={{
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      color: readMoreColor,
                      display: 'inline-block',
                      paddingTop: '1.5rem'
                    }}
                    onClick={() => setFullText(true)}
                  >
                    Read More
                  </a>
                </>
              )}
            </>
          </>
        )}
      </p>
    </div>
  );
}
