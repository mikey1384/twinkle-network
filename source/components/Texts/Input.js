import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { css } from 'emotion';
import { Color } from 'constants/css';
import { renderText } from 'helpers/stringHelpers';

Input.propTypes = {
  className: PropTypes.string,
  hasError: PropTypes.bool,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  onChange: PropTypes.func.isRequired
};
export default function Input({
  className,
  hasError,
  inputRef,
  onChange,
  ...props
}) {
  return (
    <ErrorBoundary>
      <input
        {...props}
        className={`${css`
          border: 1px solid ${Color.inputBorderGray()};
          width: 100%;
          line-height: 2rem;
          font-size: 1.7rem;
          padding: 1rem;
          &:focus {
            outline: none;
            ::placeholder {
              color: ${Color.lightGray()};
            }
          }
          ::placeholder {
            color: ${Color.gray()};
          }
          ${hasError ? 'color: red; border: 1px solid red;' : ''};
        `} ${className}`}
        ref={inputRef}
        onChange={event => onChange(renderText(event.target.value))}
      />
    </ErrorBoundary>
  );
}
