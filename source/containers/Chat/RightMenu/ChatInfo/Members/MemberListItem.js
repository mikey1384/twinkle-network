import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import Icon from 'components/Icon';
import { useChatContext } from 'contexts';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';

MemberListItem.propTypes = {
  onlineMembers: PropTypes.object,
  creatorId: PropTypes.number,
  member: PropTypes.object,
  style: PropTypes.object
};

function MemberListItem({ onlineMembers, creatorId, member, style }) {
  const {
    state: {
      ['user' + member.id]: {
        isAway,
        isBusy,
        id: userId,
        profilePicId,
        username
      } = {}
    },
    actions: { onSetUserData }
  } = useChatContext();

  useEffect(() => {
    onSetUserData(member);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member]);

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        padding: '1rem',
        ...style
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <ProfilePic
          className={css`
            height: 4rem;
            width: 4rem;
            @media (max-width: ${mobileMaxWidth}) {
              height: 3.5rem;
              width: 3.5rem;
            }
          `}
          userId={userId}
          profilePicId={profilePicId}
          online={!!onlineMembers[userId]}
          isAway={isAway}
          isBusy={isBusy}
          statusShown
        />
        <UsernameText
          truncate
          className={css`
            width: auto;
            max-width: ${creatorId === userId ? '45%' : 'CALC(45% + 3rem)'};
          `}
          style={{
            color: Color.darkerGray(),
            marginLeft: '2rem'
          }}
          user={{ id: userId, username }}
        />
        {creatorId === userId ? (
          <div
            style={{
              marginLeft: '1rem'
            }}
          >
            <Icon icon="crown" style={{ color: Color.brownOrange() }} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default memo(MemberListItem);
