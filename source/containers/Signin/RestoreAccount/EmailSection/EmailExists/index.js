import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import CheckYourEmail from './CheckYourEmail';
import SelectEmail from './SelectEmail';
import Loading from 'components/Loading';

EmailExists.propTypes = {
  email: PropTypes.string,
  verifiedEmail: PropTypes.string,
  userId: PropTypes.number.isRequired
};

export default function EmailExists({ email, userId, verifiedEmail }) {
  const hiddenEmail = useMemo(() => {
    return hideEmail(email);
  }, [email]);
  const hiddenVerifiedEmail = useMemo(() => {
    return !email || email !== verifiedEmail ? hideEmail(verifiedEmail) : '';
  }, [email, verifiedEmail]);

  const viableEmail = email || verifiedEmail;
  const hiddenViableEmail = hiddenEmail || hiddenVerifiedEmail;

  return (
    <div>
      {(hiddenEmail && !hiddenVerifiedEmail) ||
      (!hiddenEmail && hiddenVerifiedEmail) ? (
        <CheckYourEmail
          email={viableEmail}
          hiddenEmail={hiddenViableEmail}
          userId={userId}
        />
      ) : hiddenVerifiedEmail ? (
        <SelectEmail
          email={email}
          hiddenEmail={hiddenEmail}
          verifiedEmail={verifiedEmail}
          hiddenVerifiedEmail={hiddenVerifiedEmail}
          userId={userId}
        />
      ) : (
        <Loading />
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
