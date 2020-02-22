import React from 'react';
import PropTypes from 'prop-types';

SelectEmail.propTypes = {
  email: PropTypes.string,
  hiddenEmail: PropTypes.string,
  verifiedEmail: PropTypes.string,
  hiddenVerifiedEmail: PropTypes.string
};

export default function SelectEmail({
  email,
  hiddenEmail,
  verifiedEmail,
  hiddenVerifiedEmail
}) {
  return (
    <div>
      {email} {hiddenEmail} {verifiedEmail} {hiddenVerifiedEmail}
    </div>
  );
}
