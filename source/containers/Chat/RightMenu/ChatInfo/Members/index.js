import React, { memo } from 'react';
import PropTypes from 'prop-types';
import MemberListItem from './MemberListItem';
import { css } from 'emotion';

Members.propTypes = {
  channelId: PropTypes.number.isRequired,
  creatorId: PropTypes.number,
  members: PropTypes.array.isRequired,
  onlineMembers: PropTypes.array.isRequired
};

function Members({ channelId, creatorId, members, onlineMembers }) {
  return (
    <div
      className={css`
        width: 100%;
        overflow: hidden;
        overflow-y: scroll;
      `}
    >
      {members.map((member, index) => (
        <MemberListItem
          key={`channel${channelId}member${member.id}`}
          creatorId={creatorId}
          onlineMembers={onlineMembers}
          member={member}
          style={{
            paddingBottom: index === members.length - 1 ? '15rem' : '1rem'
          }}
        />
      ))}
    </div>
  );
}

export default memo(Members);
