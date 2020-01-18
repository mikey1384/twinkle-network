import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import ProfilePic from 'components/ProfilePic';
import { Color } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';

Collector.propTypes = {
  myId: PropTypes.number,
  style: PropTypes.object,
  user: PropTypes.object
};

export default function Collector({ myId, style, user }) {
  const rankColor = useMemo(() => {
    return user.rank === 1
      ? Color.gold()
      : user.rank === 2
      ? Color.lighterGray()
      : user.rank === 3
      ? Color.orange()
      : undefined;
  }, [user.rank]);
  const textColor = useMemo(
    () => rankColor || (user.rank <= 10 ? Color.logoBlue() : Color.darkGray()),
    [rankColor, user.rank]
  );

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
          style={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
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
            style={{ width: '3rem', height: '3rem' }}
            profilePicId={user.profilePicId}
            userId={user.id}
          />
          <UsernameText
            color={textColor}
            user={{ ...user, username: user.username }}
            userId={myId}
            style={{
              marginTop: '0.5rem',
              textAlign: 'center',
              fontSize: '1.2rem'
            }}
          />
        </div>
      </div>
      <div>
        <span
          style={{
            color: textColor,
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}
        >
          {addCommasToNumber(user.numWordsCollected || 0)} collected
        </span>
      </div>
    </nav>
  );
}
