import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import CheckYourEmail from './CheckYourEmail';

EmailExists.propTypes = {
  email: PropTypes.string,
  verifiedEmail: PropTypes.string,
  onEmailSent: PropTypes.func.isRequired
};

export default function EmailExists({ email, onEmailSent, verifiedEmail }) {
  const hiddenEmail = useMemo(() => {
    return hideEmail(email);
  }, [email]);
  const hiddenVerifiedEmail = useMemo(() => {
    return hideEmail(verifiedEmail);
  }, [verifiedEmail]);

  return (
    <div>
      {hiddenEmail && (
        <CheckYourEmail
          email={email}
          hiddenEmail={hiddenEmail}
          onEmailSent={onEmailSent}
        />
      )}
      {email !== verifiedEmail && hiddenVerifiedEmail && (
        <div>{hiddenVerifiedEmail}</div>
      )}
    </div>
  );

  function hideEmail(email) {
    if (!email) return null;
    let result = '';
    const emailAccountNamePart = email.split('@')[0];
    for (let i = 0; i < email.length; i++) {
      if (i !== 0 && i < emailAccountNamePart.length) {
        result += '*';
        continue;
      }
      result += email[i];
    }
    return result;
  }
}
