import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import MemberListItem from './MemberListItem';
import { css } from 'emotion';
import { useChatContext } from 'contexts';

Members.propTypes = {
  channelId: PropTypes.number.isRequired,
  creatorId: PropTypes.number,
  members: PropTypes.array.isRequired,
  onlineMembers: PropTypes.object.isRequired
};

function Members({ channelId, creatorId, members, onlineMembers }) {
  const {
    state: {
      channelOnCall: { id: channelOnCallId, members: membersOnCallObj }
    }
  } = useChatContext();

  const membersOnCall = useMemo(
    () =>
      channelOnCallId === channelId
        ? Object.entries(membersOnCallObj).map(([, member]) => member)
        : [],
    [channelId, channelOnCallId, membersOnCallObj]
  );
  const callIsOnGoing = useMemo(() => membersOnCall.length > 0, [
    membersOnCall.length
  ]);

  return (
    <div
      className={css`
        width: 100%;
        overflow: hidden;
        overflow-y: scroll;
      `}
    >
      {callIsOnGoing && <div>On Call</div>}
      {callIsOnGoing && (
        <>
          {members
            .filter(member => !!membersOnCallObj[member.id])
            .map((member, index) => (
              <MemberListItem
                key={`channel${channelId}oncall-member${member.id}`}
                creatorId={creatorId}
                onlineMembers={onlineMembers}
                membersOnCall={membersOnCall}
                member={member}
                style={{
                  paddingBottom: index === members.length - 1 ? '15rem' : '1rem'
                }}
              />
            ))}
        </>
      )}
      {callIsOnGoing && <div>Others</div>}
      {members.map((member, index) => (
        <MemberListItem
          key={`channel${channelId}member${member.id}`}
          creatorId={creatorId}
          onlineMembers={onlineMembers}
          membersOnCall={membersOnCall}
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
