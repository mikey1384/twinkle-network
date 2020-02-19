import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

CheckYourEmail.propTypes = {
  email: PropTypes.string.isRequired,
  hiddenEmail: PropTypes.string.isRequired,
  onEmailSent: PropTypes.func.isRequired
};

export default function CheckYourEmail({ email, hiddenEmail, onEmailSent }) {
  useEffect(() => {
    onEmailSent(!!email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ fontSize: '1.7rem' }}>
      We have just sent a message to {hiddenEmail} with a link to reset your
      password. Please check your inbox and follow the instructions in the
      email.
    </div>
  );
}
