import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { useHistory } from 'react-router-dom';
import { useMyState } from 'helpers/hooks';

GoBack.propTypes = {
  to: PropTypes.string,
  isMobile: PropTypes.bool,
  text: PropTypes.string
};

export default function GoBack({ isMobile, to, text }) {
  const history = useHistory();
  const { profileTheme } = useMyState();
  return (
    <div
      className={`${isMobile ? 'mobile ' : ''}${css`
        background: #fff;
        font-size: 2rem;
        font-weight: bold;
        cursor: pointer;
        width: 100%;
        height: 100%;
        display: flex;
        padding: 1rem 1rem 1.5rem 1rem;
        align-items: center;
        transition: background 0.4s;
        line-height: 1.7;
        &:hover {
          background: ${Color[profileTheme]()};
          color: #fff;
        }
        @media (max-width: ${mobileMaxWidth}) {
          font-size: 2rem;
          &:hover {
            background: #fff;
            color: #000;
          }
        }
      `}`}
      onClick={() => (to ? history.push(to) : history.goBack())}
    >
      <span>
        <Icon icon="arrow-left" /> {text || 'Go Back'}
      </span>
    </div>
  );
}
