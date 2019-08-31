import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { connect } from 'react-redux';

GoBack.propTypes = {
  profileTheme: PropTypes.string
};
function GoBack({ profileTheme }) {
  const themeColor = profileTheme || 'logoBlue';
  return (
    <div
      className={css`
        background: #fff;
        border-bottom: 1px solid ${Color.borderGray()};
        font-size: 2rem;
        font-weight: bold;
        cursor: pointer;
        width: 100%;
        height: 100%;
        display: flex;
        padding: 1rem;
        align-items: center;
        transition: background 0.4s;
        &:hover {
          background: ${Color[themeColor]()};
          color: #fff;
        }
        @media (max-width: ${mobileMaxWidth}) {
          font-size: 3rem;
          &:hover {
            background: #fff;
            color: #000;
          }
        }
      `}
    >
      <span>
        <Icon icon="arrow-left" /> Go Back
      </span>
    </div>
  );
}

export default connect(state => ({
  profileTheme: state.UserReducer.profileTheme
}))(GoBack);
