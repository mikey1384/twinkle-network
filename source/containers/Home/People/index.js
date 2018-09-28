import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'components/Texts/SearchInput';
import { connect } from 'react-redux';
import {
  clearUserSearch,
  fetchUsers,
  fetchMoreUsers,
  searchUsers
} from 'redux/actions/UserActions';
import ProfilePanel from '../ProfilePanel';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Loading from 'components/Loading';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import { stringIsEmpty, queryStringForArray } from 'helpers/stringHelpers';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';

class People extends Component {
  static propTypes = {
    chatMode: PropTypes.bool.isRequired,
    clearUserSearch: PropTypes.func.isRequired,
    fetchMoreUsers: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired,
    loadMoreButton: PropTypes.bool,
    profiles: PropTypes.array.isRequired,
    searchedProfiles: PropTypes.array.isRequired,
    searchMode: PropTypes.bool.isRequired,
    searchUsers: PropTypes.func.isRequired,
    userId: PropTypes.number
  };

  body =
    typeof document !== 'undefined'
      ? document.scrollingElement || document.documentElement
      : {};

  scrollHeight = 0;

  timer = null;

  state = {
    searchText: '',
    loading: false,
    loaded: false,
    searching: false
  };

  componentDidMount() {
    const { fetchUsers } = this.props;
    addEvent(window, 'scroll', this.onScroll);
    addEvent(document.getElementById('App'), 'scroll', this.onScroll);
    return fetchUsers().then(() => this.setState({ loaded: true }));
  }

  componentWillUnmount() {
    const { clearUserSearch } = this.props;
    clearUserSearch();
    removeEvent(window, 'scroll', this.onScroll);
    removeEvent(document.getElementById('App'), 'scroll', this.onScroll);
  }

  render() {
    const { loadMoreButton, userId, profiles, searchedProfiles } = this.props;
    const { loading, loaded, searching, searchText } = this.state;
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
          onChange={this.onPeopleSearch}
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
          {!loaded && <Loading text="Loading Users..." />}
          {loaded &&
            !searching &&
            profiles.map(profile => (
              <ProfilePanel
                expandable
                key={profile.id}
                userId={userId}
                profile={profile}
              />
            ))}
          {searching &&
            searchedProfiles.map(profile => (
              <ProfilePanel
                expandable
                key={profile.id}
                userId={userId}
                profile={profile}
              />
            ))}
          {!searching &&
            loaded &&
            loadMoreButton && (
              <LoadMoreButton
                filled
                info
                onClick={this.loadMoreProfiles}
                loading={loading}
              />
            )}
        </div>
      </div>
    );
  }

  loadMoreProfiles = async() => {
    const { fetchMoreUsers, profiles } = this.props;
    const { loading } = this.state;
    if (!loading) {
      this.setState({ loading: true });
      await fetchMoreUsers(queryStringForArray(profiles, 'id', 'shownUsers'));
      this.setState({ loading: false });
    }
  };

  onPeopleSearch = text => {
    const { searchUsers, clearUserSearch } = this.props;
    clearTimeout(this.timer);
    this.setState({ searchText: text, searching: !stringIsEmpty(text) });
    if (stringIsEmpty(text)) {
      return clearUserSearch();
    }
    this.timer = setTimeout(() => searchUsers(text), 300);
  };

  onScroll = () => {
    const { chatMode, loadMoreButton, profiles, searchMode } = this.props;
    if (
      document.getElementById('App').scrollHeight > this.scrollHeight ||
      this.body.scrollTop > this.scrollHeight
    ) {
      this.scrollHeight = Math.max(
        document.getElementById('App').scrollHeight,
        this.body.scrollTop
      );
    }
    if (
      !chatMode &&
      !searchMode &&
      profiles.length > 0 &&
      this.scrollHeight !== 0
    ) {
      this.setState(
        {
          scrollPosition: {
            desktop: document.getElementById('App').scrollTop,
            mobile: this.body.scrollTop
          }
        },
        () => {
          if (
            (this.state.scrollPosition.desktop >=
              this.scrollHeight - window.innerHeight - 1000 ||
              this.state.scrollPosition.mobile >=
                this.scrollHeight - window.innerHeight - 1000) &&
            loadMoreButton
          ) {
            this.loadMoreProfiles();
          }
        }
      );
    }
  };
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
