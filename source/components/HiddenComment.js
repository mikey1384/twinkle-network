import React from 'react';
import PropTypes from 'prop-types';
import { borderRadius, Color, desktopMinWidth } from 'constants/css';
import { css } from 'emotion';

HiddenComment.propTypes = {
  onClick: PropTypes.func
};

export default function HiddenComment({ onClick }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '1rem',
        borderRadius,
        background: Color.white(),
        border: `1px solid ${Color.black()}`,
        fontSize: '1.7rem',
        cursor: 'pointer'
      }}
      className={css`
        @media (min-width: ${desktopMinWidth}) {
          &:hover {
            text-decoration: underline;
          }
        }
      `}
      onClick={onClick}
    >
      Submit your own response to view this comment. Tap here
    </div>
  );
}
