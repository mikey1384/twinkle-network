import React from 'react';
import PropTypes from 'prop-types';
import EmailExists from './EmailExists';

EmailSection.propTypes = {
  account: PropTypes.object.isRequired,
  onEmailSent: PropTypes.func.isRequired
};

export default function EmailSection({ account, onEmailSent }) {
  return (
    <div>
      {account.email || account.verifiedEmail ? (
        <EmailExists
          email={account.email}
          verifiedEmail={account.verifiedEmail}
          onEmailSent={onEmailSent}
        />
      ) : (
        <div>You have no email</div>
      )}
    </div>
  );
}
