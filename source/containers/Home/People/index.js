import React, { useEffect, useRef, useState } from 'react';
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
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
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
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [searching, setSearching] = useState(false);

  const mounted = useRef(true);
  const BodyRef = useRef(document.scrollingElement || document.documentElement);
  const scrollHeightRef = useRef(0);
  const scrollPositionRef = useRef({ desktop: 0, mobile: 0 });
  const timerRef = useRef(null);

  useEffect(() => {
    mounted.current = true;
    addEvent(window, 'scroll', onScroll);
    addEvent(document.getElementById('App'), 'scroll', onScroll);

    return function cleanUp() {
      mounted.current = false;
      clearUserSearch();
      removeEvent(window, 'scroll', onScroll);
      removeEvent(document.getElementById('App'), 'scroll', onScroll);
    };
  }, [chatMode, profiles, searchMode, searchText]);

  useEffect(() => {
    init();
    async function init() {
      if (history.action === 'PUSH' || profiles.length === 0) {
        await fetchUsers();
        if (mounted.current) {
          setLoaded(true);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (loading) {
      loadMoreProfiles();
    }
  }, [loading]);

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
        onChange={onPeopleSearch}
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
            onClick={loadMoreProfiles}
            loading={loading}
          />
        )}
      </div>
    </div>
  );

  async function loadMoreProfiles() {
    setLoading(true);
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

  function onPeopleSearch(text) {
    clearTimeout(timerRef.current);
    setSearchText(text);
    if (stringIsEmpty(text)) {
      return clearUserSearch();
    }
    setSearching(true);
    timerRef.current = setTimeout(() => handleSearch(text), 300);
    async function handleSearch(text) {
      await searchUsers(text);
      setSearching(false);
    }
  }

  function onScroll() {
    if (
      document.getElementById('App').scrollHeight > scrollHeightRef.current ||
      BodyRef.current.scrollTop > scrollHeightRef.current
    ) {
      scrollHeightRef.current = Math.max(
        document.getElementById('App').scrollHeight,
        BodyRef.current.scrollTop
      );
    }
    if (
      !chatMode &&
      !searchMode &&
      profiles.length > 0 &&
      stringIsEmpty(searchText) &&
      scrollHeightRef.current !== 0
    ) {
      scrollPositionRef.current = {
        desktop: document.getElementById('App').scrollTop,
        mobile: BodyRef.current.scrollTop
      };
      if (
        (scrollPositionRef.current.desktop >=
          scrollHeightRef.current - window.innerHeight - 1000 ||
          scrollPositionRef.current.mobile >=
            scrollHeightRef.current - window.innerHeight - 1000) &&
        loadMoreButton
      ) {
        setLoading(true);
      }
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
