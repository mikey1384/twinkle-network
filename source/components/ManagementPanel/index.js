import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Color } from 'constants/css';

ManagementPanel.propTypes = {
  title: PropTypes.string,
  customColorTheme: PropTypes.object
};

export default function ManagementPanel({ title, customColorTheme }) {
  return (
    <div
      className={css`
        border: 1px solid ${Color.borderGray()};
        width: 75%;
        border-radius: 5px;
        background: Color.lighterGray();
        margin-bottom: 1rem;
        color: #fff;
      `}
    >
      <div
        style={{
          fontSize: '2.5rem',
          color: customColorTheme,
          fontWeight: 'bold'
        }}
      >
        {title}
      </div>
    </div>
  );
}
