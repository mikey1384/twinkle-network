import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { useAppContext } from 'contexts';

SwitchButton.propTypes = {
  color: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function SwitchButton({
  color,
  checked,
  label,
  onChange,
  style
}) {
  const {
    user: {
      state: { profileTheme }
    }
  } = useAppContext();
  return (
    <ErrorBoundary
      style={{
        display: 'flex',
        alignItems: 'center',
        ...style
      }}
    >
      {label && (
        <div style={{ marginRight: '1rem', fontSize: '1.3rem' }}>{label}</div>
      )}
      <label
        className={css`
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
          input {
            display: none;
          }
        `}
      >
        <input
          className={css`
            &:checked + span {
              background-color: ${color || Color[profileTheme]()};
            }
            &:checked + span:before {
              transform: translateX(26px);
            }
          `}
          checked={checked}
          onChange={onChange}
          type="checkbox"
        />
        <span
          className={css`
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: 0.4s;
            border-radius: 34px;
            &:before {
              position: absolute;
              content: '';
              height: 26px;
              width: 26px;
              left: 4px;
              bottom: 4px;
              background-color: white;
              transition: 0.4s;
              border-radius: 50%;
            }
          `}
        />
      </label>
    </ErrorBoundary>
  );
}
