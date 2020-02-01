import React from 'react';
import PropTypes from 'prop-types';
import { processedStringWithURL } from 'helpers/stringHelpers';

Bio.propTypes = {
  firstRow: PropTypes.string,
  secondRow: PropTypes.string,
  thirdRow: PropTypes.string,
  small: PropTypes.bool,
  style: PropTypes.object
};
export default function Bio({ firstRow, secondRow, thirdRow, small, style }) {
  return (
    <ul
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        paddingLeft: '2rem',
        lineHeight: 1.6,
        fontSize: small ? '1.5rem' : '1.7rem',
        ...style
      }}
    >
      {firstRow && (
        <li
          dangerouslySetInnerHTML={{
            __html: processedStringWithURL(firstRow)
          }}
        />
      )}
      {secondRow && (
        <li
          dangerouslySetInnerHTML={{
            __html: processedStringWithURL(secondRow)
          }}
        />
      )}
      {thirdRow && (
        <li
          dangerouslySetInnerHTML={{
            __html: processedStringWithURL(thirdRow)
          }}
        />
      )}
    </ul>
  );
}
