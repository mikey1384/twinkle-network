import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import AccountConfirm from './AccountConfirm';
import SearchInput from 'components/Texts/SearchInput';
import { Color } from 'constants/css';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { useSearch } from 'helpers/hooks';
import { useAppContext } from 'contexts';
import request from 'axios';
import URL from 'constants/URL';

UsernameSection.propTypes = {
  matchingAccount: PropTypes.object,
  onSetSearchText: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired,
  searchText: PropTypes.string.isRequired
};

export default function UsernameSection({
  matchingAccount,
  onSetSearchText,
  onNextClick,
  searchText
}) {
  const {
    user: {
      actions: { onClearUserSearch, onSearchUsers }
    }
  } = useAppContext();
  const { handleSearch, searching } = useSearch({
    onSearch: handleSearchUsers,
    onSetSearchText: text => onSetSearchText(text.trim()),
    onClear: onClearUserSearch
  });
  useEffect(() => {
    if (!stringIsEmpty(searchText)) {
      handleSearch(searchText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorBoundary>
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
        onNextClick={onNextClick}
        style={{ marginTop: '1rem' }}
        notExist={!stringIsEmpty(searchText) && !searching && !matchingAccount}
      />
    </ErrorBoundary>
  );

  async function handleSearchUsers(text) {
    const { data: users } = await request.get(
      `${URL}/user/users/search?queryString=${text}`
    );
    onSearchUsers(users);
  }
}
