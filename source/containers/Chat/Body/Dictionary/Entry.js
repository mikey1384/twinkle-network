import React from 'react';
import PropTypes from 'prop-types';
import { MessageStyle } from '../../Styles';
import ProfilePic from 'components/ProfilePic';

Entry.propTypes = {
  entry: PropTypes.object.isRequired
};

export default function Entry({ entry }) {
  return (
    <div className={MessageStyle.container}>
      <div className={MessageStyle.profilePic}>
        <ProfilePic
          style={{ width: '100%', height: '100%' }}
          userId={entry.userId}
          profilePicId={entry.profilePicId}
        />
      </div>
    </div>
  );
}
