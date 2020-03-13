import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAppContext } from 'contexts';

CheckYourEmail.propTypes = {
  email: PropTypes.string,
  hiddenEmail: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired
};

export default function CheckYourEmail({ email, hiddenEmail, userId }) {
  const {
    requestHelpers: { sendVerificationEmail }
  } = useAppContext();
  useEffect(() => {
    sendVerificationEmail({
      email: email,
      userId,
      isPasswordReset: true
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ fontSize: '1.7rem' }}>
      <p>We have just sent a message to {hiddenEmail}</p>
      <p style={{ marginTop: '1rem' }}>
        Please check your inbox and follow the instructions in the email
      </p>
    </div>
  );
}
