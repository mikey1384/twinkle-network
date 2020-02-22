import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { useAppContext } from 'contexts';

SelectEmail.propTypes = {
  email: PropTypes.string,
  hiddenEmail: PropTypes.string,
  verifiedEmail: PropTypes.string,
  hiddenVerifiedEmail: PropTypes.string,
  onEmailSent: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired
};

export default function SelectEmail({
  email,
  hiddenEmail,
  verifiedEmail,
  hiddenVerifiedEmail,
  onEmailSent,
  userId
}) {
  const {
    requestHelpers: { sendVerificationEmail }
  } = useAppContext();
  const [emailSent, setEmailSent] = useState({});

  return (
    <div style={{ fontSize: '1.7rem' }}>
      <p>
        We will now send you an email which will lead you to a page where you
        could reset your password.
      </p>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginTop: '2rem', fontWeight: 'bold' }}>
          Select the email address you want us to send the email to
        </p>
      </div>
      <div
        style={{
          marginTop: '2.5rem',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p>{hiddenEmail}</p>
          <Button
            style={{ marginLeft: '1rem' }}
            filled
            color="orange"
            onClick={() => handleSendEmail(email)}
            disabled={!!emailSent[email]}
          >
            <Icon size="lg" icon="paper-plane" />
            <span style={{ marginLeft: '1rem' }}>
              {emailSent[email] ? 'Sent' : 'Send'}
            </span>
          </Button>
        </div>
        <div
          style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}
        >
          <p>{hiddenVerifiedEmail}</p>
          <Button
            style={{ marginLeft: '1rem' }}
            filled
            color="orange"
            onClick={() => handleSendEmail(verifiedEmail)}
            disabled={!!emailSent[verifiedEmail]}
          >
            <Icon size="lg" icon="paper-plane" />
            <span style={{ marginLeft: '1rem' }}>
              {emailSent[verifiedEmail] ? 'Sent' : 'Send'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );

  function handleSendEmail(email) {
    sendVerificationEmail({ email, userId, isPasswordReset: true });
    setEmailSent(obj => ({ ...obj, [email]: true }));
    onEmailSent(!!email);
  }
}
