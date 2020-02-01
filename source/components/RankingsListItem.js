import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import ProfilePic from 'components/ProfilePic';
import { Color } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { css } from 'emotion';

RankingsListItem.propTypes = {
  myId: PropTypes.number,
  small: PropTypes.bool,
  style: PropTypes.object,
  user: PropTypes.object
};

export default function RankingsListItem({ myId, small, style, user }) {
  const rankColor = useMemo(() => {
    return user.rank === 1
      ? Color.gold()
      : user.rank === 2
      ? Color.lighterGray()
      : user.rank === 3
      ? Color.orange()
      : undefined;
  }, [user.rank]);

  const rankFontSize = useMemo(() => {
    if (small) {
      return user.rank < 100 ? '1.5rem' : '1rem';
    }
    return user.rank < 100 ? '2rem' : '1.5rem';
  }, [small, user.rank]);

  const usernameFontSize = useMemo(() => {
    return small ? '1.2rem' : '1.5rem';
  }, [small]);

  const xpFontSize = useMemo(() => {
    return small ? '1.3rem' : '1.6rem';
  }, [small]);

  const profileSize = useMemo(() => {
    return small ? '3rem' : '6rem';
  }, [small]);

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background:
          user.id === myId && user.rank > 3 ? Color.highlightGray() : '#fff',
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span
          className={css`
            font-weight: bold;
            font-size: ${rankFontSize};
            width: 3rem;
            margin-right: 1rem;
            text-align: center;
            color: ${rankColor ||
              (user.rank <= 10 ? Color.logoBlue() : Color.darkGray())};
          `}
        >
          {user.rank ? `#${user.rank}` : '--'}
        </span>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <ProfilePic
            style={{ width: profileSize, height: profileSize }}
            profilePicId={user.profilePicId}
            userId={user.id}
          />
          <UsernameText
            color={
              rankColor ||
              (user.rank <= 10 ? Color.logoBlue() : Color.darkGray())
            }
            user={{ ...user, username: user.username }}
            userId={myId}
            className={css`
              margin-top: 0.5rem;
              text-align: center;
              font-size: ${usernameFontSize};
            `}
          />
        </div>
      </div>
      <div
        className={css`
          font-weight: bold;
          font-size: ${xpFontSize};
        `}
      >
        <span style={{ color: Color.logoGreen() }}>
          {addCommasToNumber(user.twinkleXP || 0)}
        </span>{' '}
        <span style={{ color: Color.gold() }}>XP</span>
      </div>
    </nav>
  );
}
