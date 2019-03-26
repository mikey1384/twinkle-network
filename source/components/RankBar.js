import React from 'react';
import PropTypes from 'prop-types';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { borderRadius, mobileMaxWidth, Color } from 'constants/css';
import { css } from 'emotion';

RankBar.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function RankBar({ className, profile, style }) {
  const rankColor =
    profile.rank === 1
      ? Color.gold()
      : profile.rank === 2
      ? '#fff'
      : profile.rank === 3
      ? Color.bronze()
      : undefined;

  return (
    <div
      style={style}
      className={`${css`
          padding: 1.5rem 0;
          font-size: 2rem;
          color: ${rankColor};
          font-weight: bold;
          text-align: center;
          border-bottom-left-radius: ${borderRadius};
          border-bottom-right-radius: ${borderRadius};
          ${profile.rank > 3 ? `border: 1px solid ${Color.borderGray()};` : ''}
          background: ${profile.rank < 4 ? Color.black() : '#fff'};
          @media (max-width: ${mobileMaxWidth}) {
            margin-left: 0;
            margin-right: 0;
            border-radius: 0;
            border-left: none;
            border-right: none;
          }
        `} ${className}`}
    >
      <span>
        <span
          style={{
            color:
              rankColor ||
              (profile.rank <= 10 ? Color.logoBlue() : Color.darkGray())
          }}
        >
          Rank
        </span>{' '}
        <span
          style={{
            color:
              rankColor ||
              (profile.rank <= 10 ? Color.logoBlue() : Color.darkGray())
          }}
        >
          #{profile.rank}
        </span>{' '}
        <span
          style={{
            color:
              rankColor ||
              (profile.rank <= 10 ? Color.logoBlue() : Color.darkGray())
          }}
        >
          with
        </span>
      </span>{' '}
      <span>
        <span
          style={{
            color:
              rankColor ||
              (profile.rank <= 10 ? Color.logoGreen() : Color.darkGray())
          }}
        >
          {addCommasToNumber(profile.twinkleXP)}
        </span>{' '}
        <span
          style={{
            color:
              rankColor ||
              (profile.rank <= 10 ? Color.gold() : Color.darkGray())
          }}
        >
          XP
        </span>
        {!!profile.xpThisMonth && (
          <span
            style={{
              fontSize: '1.7rem',
              color:
                rankColor ||
                (profile.xpThisMonth >= 1000 ? Color.pink() : Color.darkGray())
            }}
          >
            {' '}
            (↑
            {addCommasToNumber(profile.xpThisMonth)} this month)
          </span>
        )}
      </span>
    </div>
  );
}
