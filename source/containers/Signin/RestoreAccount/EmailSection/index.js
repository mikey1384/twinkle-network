import React from 'react';
import PropTypes from 'prop-types';

EmailSection.propTypes = {
  account: PropTypes.object.isRequired
};

export default function EmailSection({ account }) {
  return (
    <div>
      This is email section {account.username}! your email is {account.email}{' '}
      your verified Email is {account.verifiedEmail}
    </div>
  );
}
