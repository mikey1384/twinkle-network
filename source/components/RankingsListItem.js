import React from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import ProfilePic from 'components/ProfilePic';
import { Color } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';

RankingsListItem.propTypes = {
  myId: PropTypes.number,
  user: PropTypes.object
};

export default function RankingsListItem({ myId, user }) {
  const rankColor =
    user.rank === 1
      ? Color.gold()
      : user.rank === 2
      ? Color.lighterGray()
      : user.rank === 3
      ? Color.orange()
      : undefined;
  return (
    <li
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background:
          user.id === myId && user.rank > 3 ? Color.highlightGray() : '#fff'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span
          style={{
            fontWeight: 'bold',
            fontSize: user.rank < 100 ? '2rem' : '1.5rem',
            width: '3rem',
            marginRight: '1rem',
            textAlign: 'center',
            color:
              rankColor ||
              (user.rank <= 10 ? Color.logoBlue() : Color.darkGray())
          }}
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
            style={{ width: '6rem', height: '6rem' }}
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
            style={{ marginTop: '0.5rem', textAlign: 'center' }}
          />
        </div>
      </div>
      <div style={{ fontWeight: 'bold' }}>
        <span style={{ color: Color.logoGreen() }}>
          {addCommasToNumber(user.twinkleXP || 0)}
        </span>{' '}
        <span style={{ color: Color.gold() }}>XP</span>
      </div>
    </li>
  );
}
