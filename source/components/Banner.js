import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { css } from 'emotion';
import { Color } from 'constants/css';

Banner.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  innerRef: PropTypes.func,
  loading: PropTypes.bool,
  style: PropTypes.object,
  onClick: PropTypes.func
};

export default function Banner({
  children,
  color = 'pink',
  innerRef,
  loading,
  onClick,
  style = {}
}) {
  const timerRef = useRef(null);
  const [spinnerShown, setSpinnerShown] = useState(false);
  useEffect(() => {
    if (loading) {
      timerRef.current = setTimeout(() => setSpinnerShown(true), 500);
    } else {
      clearTimeout(timerRef.current);
      setSpinnerShown(false);
    }
  }, [loading]);

  return (
    <div
      ref={innerRef}
      className={css`
        opacity: ${loading ? 0.5 : 1};
        width: 100%;
        background: ${Color[color]()};
        color: #fff;
        padding: 1.5rem;
        text-align: center;
        font-size: 2rem;
        justify-content: center;
        &:hover {
          ${onClick && !loading ? 'opacity: 0.8;' : ''};
        }
      `}
      style={{
        ...style,
        cursor: onClick && !loading ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      {children}
      {loading && spinnerShown && (
        <Icon style={{ marginLeft: '1rem' }} icon="spinner" pulse />
      )}
    </div>
  );
}
