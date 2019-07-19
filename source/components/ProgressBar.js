import React from 'react';
import PropTypes from 'prop-types';
import { borderRadius, Color, innerBorderRadius } from 'constants/css';
import { css } from 'emotion';

ProgressBar.propTypes = {
  noBorderRadius: PropTypes.bool,
  progress: PropTypes.number.isRequired,
  color: PropTypes.string,
  style: PropTypes.object,
  text: PropTypes.string
};

export default function ProgressBar({
  color = Color.blue(),
  noBorderRadius,
  progress,
  style = {},
  text
}) {
  return (
    <div
      className={css`
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
        height: 2.2rem;
        line-height: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-top: 1rem;
        section {
          margin-left: 0;
          transition: width 0.5s;
          border: 1px solid ${color};
          border-top-left-radius: ${innerBorderRadius};
          border-bottom-left-radius: ${innerBorderRadius};
          border-top-right-radius: ${progress >= 100 ? innerBorderRadius : 0};
          border-bottom-right-radius: ${progress >= 100
            ? innerBorderRadius
            : 0};
        }
      `}
      style={{
        ...style,
        borderLeft: noBorderRadius && 'none',
        borderRight: noBorderRadius && 'none',
        borderRadius: noBorderRadius && 0
      }}
    >
      <section
        style={{
          background: color,
          width: `${progress}%`,
          height: '100%',
          display: 'flex',
          opacity: progress > 0 ? 1 : 0,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: noBorderRadius && 0
        }}
      >
        <span
          style={{
            color: '#fff',
            fontSize: '1.2rem'
          }}
        >
          {text || `${progress}%`}
        </span>
      </section>
    </div>
  );
}
