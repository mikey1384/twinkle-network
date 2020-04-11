import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { borderRadius, Color } from 'constants/css';
import { css } from 'emotion';

ChannelDetail.propTypes = {
  channelName: PropTypes.string.isRequired,
  members: PropTypes.array.isRequired
};

export default function ChannelDetail({ channelName, members }) {
  const [shownMembers, setShownMembers] = useState([]);
  const [more, setMore] = useState(null);
  useEffect(() => {
    if (members.length > 5) {
      setShownMembers(members.filter((member, index) => index < 5));
      setMore(members.length - 5);
    } else {
      setShownMembers(members);
    }
  }, [members]);

  return (
    <div
      style={{
        marginBottom: '1rem',
        padding: '1rem',
        background: Color.highlightGray(),
        color: Color.black(),
        borderRadius
      }}
    >
      <p
        style={{
          fontWeight: 'bold',
          fontSize: '2rem',
          color: Color.logoBlue()
        }}
      >
        Invitation to join chat group:
      </p>
      <div
        style={{ fontWeight: 'bold', fontSize: '2rem', marginTop: '0.5rem' }}
      >
        {channelName}
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <p style={{ fontWeight: 'bold', fontSize: '1.7rem' }}>members:</p>
        <div style={{ marginTop: '0.5rem' }}>
          {shownMembers.map((member) => (
            <div key={member.id}>{member.username}</div>
          ))}
          {more && (
            <div style={{ marginTop: '0.5rem' }}>
              <span
                className={css`
                  font-size: 1.5rem;
                  cursor: pointer;
                  color: ${Color.blue()};
                  &:hover {
                    text-decoration: underline;
                  }
                `}
                onClick={handleMoreClick}
              >
                ...and {more} more
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function handleMoreClick() {
    console.log(members);
  }
}
