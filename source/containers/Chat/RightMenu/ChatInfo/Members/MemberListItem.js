import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import Icon from 'components/Icon';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';

MemberListItem.propTypes = {
  onlineMembers: PropTypes.array,
  creatorId: PropTypes.number,
  member: PropTypes.object,
  style: PropTypes.object
};

function MemberListItem({ onlineMembers, creatorId, member, style }) {
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
          userId={member.id}
          profilePicId={member.profilePicId}
          online={onlineMembers.map(member => member.id).includes(member.id)}
          isAway={member.isAway}
          statusShown
        />
        <UsernameText
          truncate
          className={css`
            width: auto;
            max-width: ${creatorId === member.id ? '45%' : 'CALC(45% + 3rem)'};
          `}
          style={{
            color: Color.darkerGray(),
            marginLeft: '2rem'
          }}
          user={member}
        />
        {creatorId === member.id ? (
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
