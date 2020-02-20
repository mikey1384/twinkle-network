import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import EmailSection from './EmailSection';
import UsernameSection from './UsernameSection';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { useAppContext } from 'contexts';

RestoreAccount.propTypes = {
  username: PropTypes.string,
  onShowLoginForm: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired
};

export default function RestoreAccount({ username, onShowLoginForm, onHide }) {
  const {
    user: {
      state: { searchedProfiles }
    }
  } = useAppContext();
  const [section, setSection] = useState('username');
  const [searchText, setSearchText] = useState(username);
  const [emailSent, setEmailSent] = useState(false);

  const matchingAccount = useMemo(() => {
    if (
      searchedProfiles.filter(profile => profile.username === searchText)
        .length > 0
    ) {
      return searchedProfiles[0];
    }
    return null;
  }, [searchText, searchedProfiles]);

  const disabled = useMemo(() => {
    if (section === 'username') return !matchingAccount;
    return !emailSent;
  }, [emailSent, matchingAccount, section]);

  const headerTitle = useMemo(() => {
    if (section === 'username') return 'No problem! We are here to help';
    if (section === 'email') {
      if (matchingAccount?.email || matchingAccount?.verifiedEmail) {
        return `Email confirmation`;
      } else {
        return `Please enter you or your parent's email address`;
      }
    }
    return 'TBD';
  }, [matchingAccount, section]);

  return (
    <ErrorBoundary>
      <header>{headerTitle}</header>
      <main>
        {section === 'username' && (
          <UsernameSection
            matchingAccount={matchingAccount}
            onNextClick={handleNextClick}
            onSetSearchText={setSearchText}
            searchText={searchText}
          />
        )}
        {section === 'email' && (
          <EmailSection account={matchingAccount} onEmailSent={setEmailSent} />
        )}
      </main>
      <footer>
        {section === 'username' && (
          <Button
            transparent
            color="orange"
            style={{
              fontSize: '1.5rem',
              marginRight: '1rem'
            }}
            onClick={onShowLoginForm}
          >
            I remember my password
          </Button>
        )}
        <Button
          color="blue"
          disabled={disabled}
          onClick={handleNextClick}
          style={{ fontSize: '2rem' }}
        >
          {section === 'username' ? (
            <>
              Next <Icon icon="arrow-right" style={{ marginLeft: '0.7rem' }} />
            </>
          ) : (
            'Go to my email inbox'
          )}
        </Button>
      </footer>
    </ErrorBoundary>
  );

  function handleNextClick() {
    if (section === 'username') {
      return setSection('email');
    }
    if (!matchingAccount.email) return;
    const emailProvider = 'http://www.' + matchingAccount?.email.split('@')[1];
    window.open(emailProvider, '_blank');
    onHide();
  }
}
