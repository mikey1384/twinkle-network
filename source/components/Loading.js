import PropTypes from 'prop-types';
import React from 'react';
import Spinner from 'components/Spinner';
import { css } from 'emotion';

Loading.propTypes = {
  className: PropTypes.string,
  innerStyle: PropTypes.object,
  style: PropTypes.object,
  text: PropTypes.string
};

export default function Loading({
  className,
  text = '',
  innerStyle = {},
  style = {}
}) {
  return (
    <div
      className={
        className ||
        css`
          height: 15rem;
          width: 100%;
        `
      }
      style={style}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '2.8rem',
          ...innerStyle
        }}
      >
        <Spinner />
        {text && <div style={{ marginLeft: '1.5rem' }}>{text}</div>}
      </div>
    </div>
  );
}
