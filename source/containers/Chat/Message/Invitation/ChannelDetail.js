import React from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';

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
        background: Color.logoBlue(),
        color: '#fff'
      }}
    >
      <p
        style={{ fontWeight: 'bold', fontSize: '2rem' }}
      >{`Invitation to join chat group: "${channelName}"`}</p>
      <div>
        <p style={{ fontWeight: 'bold', fontSize: '1.7rem' }}>
          Current members:
        </p>
        {members.map((member) => (
          <div key={member.id}>{member.username}</div>
        ))}
      </div>
    </div>
  );
}
