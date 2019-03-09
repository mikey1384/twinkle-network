import React, { useEffect, useRef, useState } from 'react';
import { useInfiniteScroll, useSearch } from 'helpers/hooks';
import PropTypes from 'prop-types';
import SearchInput from 'components/Texts/SearchInput';
import { connect } from 'react-redux';
import {
  clearUserSearch,
  fetchUsers,
  fetchMoreUsers,
  searchUsers
} from 'redux/actions/UserActions';
import ProfilePanel from 'components/ProfilePanel';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Loading from 'components/Loading';
import { stringIsEmpty, queryStringForArray } from 'helpers/stringHelpers';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';

People.propTypes = {
  chatMode: PropTypes.bool.isRequired,
  clearUserSearch: PropTypes.func.isRequired,
  fetchMoreUsers: PropTypes.func.isRequired,
  fetchUsers: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loadMoreButton: PropTypes.bool,
  profiles: PropTypes.array.isRequired,
  searchedProfiles: PropTypes.array.isRequired,
  searchMode: PropTypes.bool.isRequired,
  searchUsers: PropTypes.func.isRequired,
  userId: PropTypes.number
};

function People({
  chatMode,
  clearUserSearch,
  fetchUsers,
  fetchMoreUsers,
  history,
  loadMoreButton,
  profiles,
  userId,
  searchedProfiles,
  searchMode,
  searchUsers
}) {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { handleSearch, searching, searchText } = useSearch({
    onSearch: searchUsers,
    onClear: clearUserSearch
  });

  const mounted = useRef(true);

  useInfiniteScroll({
    scrollable:
      !chatMode &&
      !searchMode &&
      profiles.length > 0 &&
      stringIsEmpty(searchText),
    loadable: loadMoreButton,
    loading,
    onScrollToBottom: () => setLoading(true),
    onLoad: loadMoreProfiles
  });

  useEffect(() => {
    mounted.current = true;

    return function cleanUp() {
      mounted.current = false;
      clearUserSearch();
    };
  }, [chatMode, profiles, searchMode, searchText]);

  useEffect(() => {
    init();
    async function init() {
      if (history.action === 'PUSH' || profiles.length === 0) {
        await fetchUsers();
      }
      if (mounted.current) {
        setLoaded(true);
      }
    }
  }, [history.action]);

  return (
    <div style={{ height: '100%' }}>
      <SearchInput
        className={css`
          @media (max-width: ${mobileMaxWidth}) {
            margin-top: 1rem;
          }
        `}
        style={{ zIndex: 0 }}
        addonColor={Color.gold()}
        placeholder="Search for users"
        onChange={handleSearch}
        value={searchText}
      />
      <div
        style={{
          marginTop: '1rem',
          marginBottom: '1rem',
          position: 'relative',
          minHeight: '30%',
          width: '100%'
        }}
      >
        {(!loaded || (!stringIsEmpty(searchText) && searching)) && (
          <Loading text={`${searching ? 'Searching' : 'Loading'} Users...`} />
        )}
        {loaded &&
          stringIsEmpty(searchText) &&
          profiles.map(profile => (
            <ProfilePanel
              expandable
              key={profile.id}
              userId={userId}
              profile={profile}
            />
          ))}
        {!stringIsEmpty(searchText) &&
          !searching &&
          searchedProfiles.map(profile => (
            <ProfilePanel
              expandable
              key={profile.id}
              userId={userId}
              profile={profile}
            />
          ))}
        {!stringIsEmpty(searchText) &&
          !searching &&
          searchedProfiles.length === 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '15rem',
                fontSize: '2.8rem'
              }}
            >
              No Users Found
            </div>
          )}
        {stringIsEmpty(searchText) && loaded && loadMoreButton && (
          <LoadMoreButton
            filled
            info
            onClick={() => setLoading(true)}
            loading={loading}
          />
        )}
      </div>
    </div>
  );

  async function loadMoreProfiles() {
    await fetchMoreUsers(
      queryStringForArray({
        array: profiles,
        originVar: 'id',
        destinationVar: 'shownUsers'
      })
    );
    if (mounted.current) {
      setLoading(false);
    }
  }
}

export default connect(
  state => ({
    chatMode: state.ChatReducer.chatMode,
    loadMoreButton: state.UserReducer.loadMoreButton,
    profiles: state.UserReducer.profiles,
    searchMode: state.SearchReducer.searchMode,
    searchedProfiles: state.UserReducer.searchedProfiles,
    userId: state.UserReducer.userId
  }),
  {
    clearUserSearch,
    fetchUsers,
    fetchMoreUsers,
    searchUsers
  }
)(People);
