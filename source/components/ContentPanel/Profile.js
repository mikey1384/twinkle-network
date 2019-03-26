import React from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import RankBar from 'components/RankBar';
import UserDetails from 'components/UserDetails';
import Link from 'components/Link';
import { connect } from 'react-redux';

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
          <Link to={`/users/${profile.username}`}>
            <ProfilePic
              style={{ width: '15rem', height: '15rem', cursor: 'pointer' }}
              userId={profile.id}
              profilePicId={profile.profilePicId}
              online={userId === profile.id || !!profile.online}
              large
            />
          </Link>
        </div>
        <UserDetails
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
          style={{
            borderLeft: 'none',
            borderRight: 'none',
            borderRadius: 0,
            marginLeft: profile.rank < 4 ? '-1px' : '',
            marginRight: profile.rank < 4 ? '-1px' : ''
          }}
        />
      )}
    </div>
  );
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(Profile);
