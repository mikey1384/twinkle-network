import React from 'react';
import PropTypes from 'prop-types';
import EmailExists from './EmailExists';

EmailSection.propTypes = {
  account: PropTypes.object.isRequired
};

export default function EmailSection({ account }) {
  return (
    <div>
      {account.email || account.verifiedEmail ? (
        <EmailExists
          email={account.email}
          verifiedEmail={account.verifiedEmail}
          userId={account.id}
        />
      ) : (
        <div style={{ fontSize: '1.7rem' }}>
          <span>{`We need your email address in order for us to make sure you are the owner of this account. `}</span>
          <b>Ask your Twinkle teacher for help.</b>
        </div>
      )}
    </div>
  );
}
