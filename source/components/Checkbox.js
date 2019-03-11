import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { innerBorderRadius, Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

Checkbox.propTypes = {
  backgroundColor: PropTypes.string,
  checked: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  profileTheme: PropTypes.string,
  style: PropTypes.object,
  textIsClickable: PropTypes.bool
};

function Checkbox({
  backgroundColor = Color.wellGray(),
  checked,
  label,
  onClick,
  profileTheme,
  style,
  textIsClickable
}) {
  const themeColor = profileTheme || 'logoBlue';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        postion: 'relative',
        width: '100%',
        fontSize: '1.2rem',
        ...style
      }}
    >
      {label && (
        <span
          style={{
            color: Color.darkerGray(),
            cursor: textIsClickable ? 'pointer' : 'default'
          }}
          onClick={textIsClickable ? onClick : () => {}}
        >
          {label}
          &nbsp;&nbsp;
        </span>
      )}
      <div
        onClick={onClick}
        style={{
          borderRadius: innerBorderRadius,
          border: `1px solid ${Color.borderGray()}`,
          width: '2rem',
          height: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          background: checked ? Color[themeColor]() : backgroundColor
        }}
      >
        {checked && (
          <div
            className={css`
              display: inline-block;
              width: 0.6rem;
              height: 1rem;
              margin-top: 2%;
              border: solid #fff;
              border-width: 0 3px 3px 0;
              transform: rotate(45deg);
              @media (max-width: ${mobileMaxWidth}) {
                border-width: 0 2px 2px 0;
              }
            `}
          />
        )}
      </div>
    </div>
  );
}

export default connect(state => ({
  profileTheme: state.UserReducer.profileTheme
}))(Checkbox);
