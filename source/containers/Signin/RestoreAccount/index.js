import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'components/Texts/SearchInput';
import ErrorBoundary from 'components/ErrorBoundary';
import AccountConfirm from './AccountConfirm';
import request from 'axios';
import URL from 'constants/URL';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { useAppContext } from 'contexts';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { useSearch } from 'helpers/hooks';
import { Color } from 'constants/css';

RestoreAccount.propTypes = {
  username: PropTypes.string,
  onShowLoginForm: PropTypes.func.isRequired
};

export default function RestoreAccount({ username, onShowLoginForm }) {
  const {
    user: {
      state: { searchedProfiles },
      actions: { onClearUserSearch, onSearchUsers }
    }
  } = useAppContext();
  const [searchText, setSearchText] = useState(username);
  const { handleSearch, searching } = useSearch({
    onSearch: handleSearchUsers,
    onSetSearchText: text => setSearchText(text.trim()),
    onClear: onClearUserSearch
  });
  useEffect(() => {
    if (!stringIsEmpty(searchText)) {
      handleSearch(searchText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const matchingAccount = useMemo(() => {
    if (
      searchedProfiles.filter(profile => profile.username === searchText)
        .length > 0
    ) {
      return searchedProfiles[0].username;
    }
    return null;
  }, [searchText, searchedProfiles]);

  return (
    <ErrorBoundary>
      <main>
        <p
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: Color.black()
          }}
        >
          What is your username?
        </p>
        <p
          style={{
            fontSize: '2.7rem',
            fontWeight: 'bold',
            marginTop: '2rem'
          }}
        >
          {stringIsEmpty(searchText) ? 'My username is...' : ` "${searchText}"`}
        </p>
        <SearchInput
          autoFocus
          style={{ marginTop: '1rem', width: '70%' }}
          placeholder="Type your username"
          onChange={handleSearch}
          value={searchText}
        />
        <AccountConfirm
          searching={searching}
          matchingAccount={matchingAccount}
          style={{ marginTop: '1rem' }}
          notExist={
            !stringIsEmpty(searchText) && !searching && !matchingAccount
          }
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
          Wait, I remember my password!
        </Button>
        <Button
          color="blue"
          disabled={!matchingAccount}
          onClick={() => console.log('hit')}
          style={{ fontSize: '2rem' }}
        >
          Next <Icon icon="arrow-right" style={{ marginLeft: '0.7rem' }} />
        </Button>
      </footer>
    </ErrorBoundary>
  );

  async function handleSearchUsers(text) {
    const { data: users } = await request.get(
      `${URL}/user/users/search?queryString=${text}`
    );
    onSearchUsers(users);
  }
}
