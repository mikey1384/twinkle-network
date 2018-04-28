import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SearchInput from 'components/Texts/SearchInput'
import { connect } from 'react-redux'
import {
  clearUserSearch,
  fetchUsers,
  fetchMoreUsers,
  searchUsers
} from 'redux/actions/UserActions'
import ProfilePanel from '../ProfilePanel'
import LoadMoreButton from 'components/LoadMoreButton'
import Loading from 'components/Loading'
import { addEvent, removeEvent } from 'helpers/listenerHelpers'
import { stringIsEmpty, queryStringForArray } from 'helpers/stringHelpers'
import { Color } from 'constants/css'

class People extends Component {
  static propTypes = {
    chatMode: PropTypes.bool,
    clearUserSearch: PropTypes.func.isRequired,
    fetchMoreUsers: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired,
    loadMoreButton: PropTypes.bool,
    profiles: PropTypes.array.isRequired,
    searchedProfiles: PropTypes.array.isRequired,
    searchUsers: PropTypes.func.isRequired,
    userId: PropTypes.number
  }

  scrollHeight = 0

  timer = null

  state = {
    searchText: '',
    loading: false,
    loaded: false,
    searching: false
  }

  componentDidMount() {
    const { fetchUsers } = this.props
    addEvent(document.getElementById('react-view'), 'scroll', this.onScroll)
    return fetchUsers().then(() => this.setState({ loaded: true }))
  }

  componentWillUnmount() {
    const { clearUserSearch } = this.props
    clearUserSearch()
    removeEvent(document.getElementById('react-view'), 'scroll', this.onScroll)
  }

  render() {
    const { loadMoreButton, userId, profiles, searchedProfiles } = this.props
    const { loading, loaded, searching, searchText } = this.state
    return (
      <div
        ref={ref => {
          this.Container = ref
        }}
        style={{ height: '100%' }}
      >
        <SearchInput
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
                onClick={this.loadMoreProfiles}
                loading={loading}
              />
            )}
        </div>
      </div>
    )
  }

  loadMoreProfiles = () => {
    const { fetchMoreUsers, profiles } = this.props
    const { loading } = this.state
    if (!loading) {
      this.setState({ loading: true })
      return fetchMoreUsers(
        queryStringForArray(profiles, 'id', 'shownUsers')
      ).then(() => this.setState({ loading: false }))
    }
  }

  onPeopleSearch = text => {
    const { searchUsers, clearUserSearch } = this.props
    clearTimeout(this.timer)
    this.setState({ searchText: text, searching: !stringIsEmpty(text) })
    if (stringIsEmpty(text)) {
      return clearUserSearch()
    }
    this.timer = setTimeout(() => searchUsers(text), 300)
  }

  onScroll = () => {
    const { chatMode, profiles } = this.props
    if (
      document.getElementById('react-view').scrollHeight > this.scrollHeight
    ) {
      this.scrollHeight = document.getElementById('react-view').scrollHeight
    }
    if (!chatMode && profiles.length > 0 && this.scrollHeight !== 0) {
      this.setState(
        { scrollPosition: document.getElementById('react-view').scrollTop },
        () => {
          if (
            this.state.scrollPosition >=
            this.Container.offsetHeight - window.innerHeight - 500
          ) {
            this.loadMoreProfiles()
          }
        }
      )
    }
  }
}

export default connect(
  state => ({
    chatMode: state.ChatReducer.chatMode,
    loadMoreButton: state.UserReducer.loadMoreButton,
    profiles: state.UserReducer.profiles,
    searchedProfiles: state.UserReducer.searchedProfiles,
    userId: state.UserReducer.userId
  }),
  {
    clearUserSearch,
    fetchUsers,
    fetchMoreUsers,
    searchUsers
  }
)(People)
