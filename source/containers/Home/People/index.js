import React, { useEffect, useRef, useState } from 'react';
import { useInfiniteScroll, useSearch, useScrollPosition } from 'helpers/hooks';
import PropTypes from 'prop-types';
import SearchInput from 'components/Texts/SearchInput';
import ProfilePanel from 'components/ProfilePanel';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Loading from 'components/Loading';
import PeopleFilterBar from './PeopleFilterBar';
import { stringIsEmpty, queryStringForArray } from 'helpers/stringHelpers';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';
import { useAppContext } from 'contexts';

People.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default function People({ history, location }) {
  const {
    user: {
      actions: {
        onSetProfilesLoaded,
        onClearUserSearch,
        onLoadUsers,
        onLoadMoreUsers,
        onSearchUsers
      },
      state: {
        profilesLoaded,
        loadMoreButton,
        profiles,
        profileTheme,
        searchedProfiles,
        userId
      }
    },
    view: {
      actions: { onRecordScrollPosition },
      state: { scrollPositions }
    },
    requestHelpers: { loadUsers }
  } = useAppContext();
  const LAST_ONLINE_FILTER_LABEL = 'Last Online';
  const RANKING_FILTER_LABEL = 'Ranking';
  const [orderBy, setOrderBy] = useState(LAST_ONLINE_FILTER_LABEL);
  const [loading, setLoading] = useState(false);
  const { handleSearch, searching, searchText } = useSearch({
    onSearch: onSearchUsers,
    onClear: onClearUserSearch
  });
  const mounted = useRef(true);
  const dropdownLabel =
    orderBy === LAST_ONLINE_FILTER_LABEL
      ? RANKING_FILTER_LABEL
      : LAST_ONLINE_FILTER_LABEL;

  useInfiniteScroll({
    scrollable: profiles.length > 0 && stringIsEmpty(searchText),
    loadable: loadMoreButton,
    loading,
    feedsLength: profiles.length,
    onScrollToBottom: () => setLoading(true),
    onLoad: loadMoreProfiles
  });

  useScrollPosition({
    scrollPositions,
    pathname: location.pathname,
    onRecordScrollPosition,
    currentSection: `/users`
  });

  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      mounted.current = false;
      onClearUserSearch();
    };
  }, [searchText]);

  useEffect(() => {
    init();
    async function init() {
      if (profiles.length === 0) {
        const data = await loadUsers();
        onLoadUsers(data);
        onSetProfilesLoaded(true);
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
        addonColor={profileTheme}
        borderColor={profileTheme}
        placeholder="Search Users"
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
        <PeopleFilterBar
          style={{
            marginBottom: '1rem'
          }}
          onSetOrderByText={handleSetOrderBy}
          orderByText={orderBy}
          dropdownLabel={dropdownLabel}
        />
        {(!profilesLoaded || (!stringIsEmpty(searchText) && searching)) && (
          <Loading text={`${searching ? 'Searching' : 'Loading'} Users...`} />
        )}
        {profilesLoaded &&
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
        {stringIsEmpty(searchText) && profilesLoaded && loadMoreButton && (
          <LoadMoreButton
            filled
            color="lightBlue"
            onClick={() => setLoading(true)}
            loading={loading}
          />
        )}
      </div>
    </div>
  );

  async function handleSetOrderBy(label) {
    onSetProfilesLoaded(false);
    const data = await loadUsers({
      orderBy: label === RANKING_FILTER_LABEL ? 'twinkleXP' : ''
    });
    onLoadUsers(data);
    setOrderBy(label);
    onSetProfilesLoaded(true);
  }

  async function loadMoreProfiles() {
    const data = await loadUsers({
      shownUsersIds: queryStringForArray({
        array: profiles,
        originVar: 'id',
        destinationVar: 'shownUsers'
      }),
      orderBy: orderBy === RANKING_FILTER_LABEL ? 'twinkleXP' : ''
    });
    onLoadMoreUsers(data);
    if (mounted.current) {
      setLoading(false);
    }
  }
}
