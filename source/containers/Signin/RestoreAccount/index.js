import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import UsernameSection from './UsernameSection';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { useAppContext } from 'contexts';

RestoreAccount.propTypes = {
  username: PropTypes.string,
  onShowLoginForm: PropTypes.func.isRequired
};

export default function RestoreAccount({ username, onShowLoginForm }) {
  const {
    user: {
      state: { searchedProfiles }
    }
  } = useAppContext();
  const [searchText, setSearchText] = useState(username);

  const matchingAccount = useMemo(() => {
    if (
      searchedProfiles.filter(profile => profile.username === searchText)
        .length > 0
    ) {
      return searchedProfiles[0];
    }
    return null;
  }, [searchText, searchedProfiles]);

  return (
    <ErrorBoundary>
      <main>
        <UsernameSection
          matchingAccount={matchingAccount}
          onNextClick={handleNextClick}
          onSetSearchText={setSearchText}
          searchText={searchText}
        />
      </main>
      <footer>
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
        <Button
          color="blue"
          disabled={!matchingAccount}
          onClick={handleNextClick}
          style={{ fontSize: '2rem' }}
        >
          Next <Icon icon="arrow-right" style={{ marginLeft: '0.7rem' }} />
        </Button>
      </footer>
    </ErrorBoundary>
  );

  function handleNextClick() {
    console.log('hit');
  }
}
