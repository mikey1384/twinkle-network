import React from 'react';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import Icon from './Icon';

Achievement.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  iconColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  earnText: PropTypes.string,
  hadEarned: PropTypes.bool
};
export default function Achievement({
  title = 'Default Achievement',
  icon = 'crown',
  iconColor = 'yellow',
  backgroundColor = 'rgb(0,200,200)',
  earnText = 'Default Earn Way',
  hadEarned = true
}) {
  const bgc = hadEarned ? backgroundColor : 'rgb(173, 173, 173)';
  return (
    <div
      className={css`
        border: 3px solid ${bgc};
        width: 100%;
        height: 12rem;
        margin-bottom: 0.2rem;
        background: ${bgc};
        text-align: center;
        display: flex;
        align-items: center;
        .title {
          padding: 1rem;
        }
      `}
    >
      <div style={{ padding: '1.5rem' }}>
        <Icon
          size="6x"
          icon={hadEarned ? icon : 'lock'}
          color={hadEarned ? Color[iconColor]() : Color.darkGray()}
        />
      </div>

      <div
        className="title"
        style={{ color: Color.white(), fontWeight: 'bold', fontSize: '2.4rem' }}
      >
        <div>Achievement: {title}</div>
        <div style={{ textAlign: 'left' }}>
          <div
            style={{
              color: Color.black(),
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}
          >
            {earnText}
          </div>
        </div>
      </div>
    </div>
  );
}
