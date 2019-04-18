import React from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import RankBar from 'components/RankBar';
import UserDetails from 'components/UserDetails';
import { connect } from 'react-redux';
import { css } from 'emotion';

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  userId: PropTypes.number
};

function Profile({ profile, userId }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <ProfilePic
            style={{ width: '15rem', height: '15rem', cursor: 'pointer' }}
            userId={profile.id}
            profilePicId={profile.profilePicId}
            online={userId === profile.id || !!profile.online}
            large
          />
        </div>
        <UserDetails
          noLink
          small
          unEditable
          profile={profile}
          style={{
            width: 'CALC(100% - 18rem)',
            marginLeft: '1rem',
            fontSize: '1.5rem'
          }}
          userId={userId}
        />
      </div>
      {!!profile.twinkleXP && (
        <RankBar
          profile={profile}
          className={css`
            margin-left: ${!!profile.rank && profile.rank < 4 ? '-1px' : ''};
            margin-right: ${!!profile.rank && profile.rank < 4 ? '-1px' : ''};
          `}
          style={{
            borderLeft: 'none',
            borderRight: 'none',
            borderRadius: 0
          }}
        />
      )}
    </div>
  );
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(Profile);
