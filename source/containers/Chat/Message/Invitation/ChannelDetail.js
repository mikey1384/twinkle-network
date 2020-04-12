import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { borderRadius, Color } from 'constants/css';
import { css } from 'emotion';
import { useMyState } from 'helpers/hooks';
import UserListModal from 'components/Modals/UserListModal';

ChannelDetail.propTypes = {
  channelName: PropTypes.string.isRequired,
  members: PropTypes.array.isRequired
};

export default function ChannelDetail({ channelName, members }) {
  const { profileTheme } = useMyState();
  const [shownMembers, setShownMembers] = useState([]);
  const [userListModalShown, setUserListModalShown] = useState(false);
  const [more, setMore] = useState(null);
  useEffect(() => {
    if (members.length > 3) {
      setShownMembers(members.filter((member, index) => index < 3));
      setMore(members.length - 3);
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
          fontSize: '2.2rem',
          color: Color[profileTheme]()
        }}
      >
        Invitation to {channelName}
      </p>
      <div style={{ marginTop: '0.5rem' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.7rem' }}>members:</span>{' '}
        {shownMembers.map((member, index) => (
          <span key={member.id}>
            {member.username}
            {index === members.length - 1 ? '' : ', '}
          </span>
        ))}
        {more && (
          <span
            className={css`
              font-size: 1.5rem;
              cursor: pointer;
              color: ${Color.blue()};
              &:hover {
                text-decoration: underline;
              }
            `}
            onClick={() => setUserListModalShown(true)}
          >
            ...and {more} more
          </span>
        )}
      </div>
      {userListModalShown && (
        <UserListModal
          onHide={() => setUserListModalShown(false)}
          title="Members"
          users={members}
        />
      )}
    </div>
  );
}
