import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import MemberListItem from './MemberListItem';
import { useChatContext } from 'contexts';
import { Color } from 'constants/css';

Members.propTypes = {
  channelId: PropTypes.number.isRequired,
  creatorId: PropTypes.number,
  imLive: PropTypes.bool,
  isClass: PropTypes.bool,
  members: PropTypes.array.isRequired,
  onlineMembers: PropTypes.object.isRequired
};

function Members({
  channelId,
  creatorId,
  imLive,
  isClass,
  members,
  onlineMembers
}) {
  const {
    state: {
      peerStreams,
      channelOnCall: { id: channelOnCallId, members: membersOnCallObj }
    }
  } = useChatContext();

  const membersOnCall = useMemo(
    () =>
      channelOnCallId === channelId
        ? members.filter(member => !!membersOnCallObj[member.id])
        : [],
    [channelId, channelOnCallId, members, membersOnCallObj]
  );

  const membersNotOnCall = useMemo(
    () =>
      channelOnCallId === channelId
        ? members.filter(member => !membersOnCallObj[member.id])
        : members,
    [channelId, channelOnCallId, members, membersOnCallObj]
  );

  const callIsOnGoing = useMemo(() => membersOnCall.length > 0, [
    membersOnCall.length
  ]);

  return (
    <div style={{ width: '100%' }}>
      {callIsOnGoing && (
        <div
          style={{
            textAlign: 'center',
            width: '100%',
            fontWeight: 'bold',
            color: Color.darkerGray()
          }}
        >
          on call
        </div>
      )}
      {callIsOnGoing && (
        <div style={{ marginBottom: '2rem' }}>
          {membersOnCall.map(member => (
            <MemberListItem
              key={`channel${channelId}-oncall-member${member.id}`}
              channelId={channelId}
              creatorId={creatorId}
              onlineMembers={onlineMembers}
              member={member}
              imLive={imLive}
              isClass={isClass}
              membersOnCallObj={membersOnCallObj}
              peerStreams={peerStreams}
            />
          ))}
        </div>
      )}
      {callIsOnGoing && membersNotOnCall.length > 0 && (
        <div
          style={{
            textAlign: 'center',
            width: '100%',
            fontWeight: 'bold',
            color: Color.darkerGray()
          }}
        >
          others
        </div>
      )}
      {membersNotOnCall.map((member, index) => (
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
