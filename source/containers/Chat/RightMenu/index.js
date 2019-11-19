import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';

RightMenu.propTypes = {
  channelName: PropTypes.string
};

export default function RightMenu({ channelName }) {
  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 35rem;
        position: relative;
        background: #fff;
        border-left: 1px solid ${Color.borderGray()};
        -webkit-overflow-scrolling: touch;
        @media (max-width: ${mobileMaxWidth}) {
          width: 25%;
        }
      `}
    >
      <div
        style={{
          width: '100%',
          fontWeight: 'bold',
          display: 'flex',
          padding: '1rem',
          fontSize: '2.5rem',
          justifyContent: 'center',
          color: Color.darkerGray()
        }}
      >
        {channelName}
      </div>
    </div>
  );
}
