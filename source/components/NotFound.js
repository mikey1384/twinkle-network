import PropTypes from 'prop-types';
import React from 'react';
import { css } from 'emotion';

NotFound.propTypes = {
  text: PropTypes.string,
  title: PropTypes.string
};

export default function NotFound({ title, text }) {
  return (
    <div
      className={css`
        padding-top: 25rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 1.6rem;
        p {
          font-size: 4rem;
          font-weight: bold;
        }
        span {
          margin-top: 1rem;
        }
      `}
    >
      <p>{title || 'Not Found'}</p>
      <span>{text || 'The page you requested does not exist'}</span>
    </div>
  );
}
