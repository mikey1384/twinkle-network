import React from 'react';
import PropTypes from 'prop-types';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

TargetSubject.propTypes = {
  subject: PropTypes.object.isRequired
};

export default function TargetSubject({ subject }) {
  return (
    <div
      style={{
        marginTop: '0.5rem',
        marginBottom: '1rem',
        padding: '1rem',
        background: Color.wellGray(),
        display: 'flex',
        justifyContent: 'space-between',
        borderRadius
      }}
      className={css`
        width: 85%;
        @media (max-width: ${mobileMaxWidth}) {
          width: 100%;
        }
      `}
    >
      <div style={{ width: '100%', fontWeight: 'bold' }}>{subject.content}</div>
    </div>
  );
}
