import React from 'react';
import PropTypes from 'prop-types';
import { borderRadius, Color } from 'constants/css';

ChannelDetail.propTypes = {
  channelName: PropTypes.string.isRequired,
  members: PropTypes.array.isRequired
};

export default function ChannelDetail({ channelName, members }) {
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
        {members.map((member) => (
          <div key={member.id}>{member.username}</div>
        ))}
      </div>
    </div>
  );
}
