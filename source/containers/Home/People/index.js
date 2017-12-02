import React, {Component} from 'react'
import PropTypes from 'prop-types'
import SearchInput from 'components/Texts/SearchInput'
import {connect} from 'react-redux'
import {clearUserSearch, fetchUsers, fetchMoreUsers, searchUsers} from 'redux/actions/UserActions'
import ProfilePanel from '../ProfilePanel'
import LoadMoreButton from 'components/LoadMoreButton'
import Loading from 'components/Loading'
import {addEvent, removeEvent} from 'helpers/listenerHelpers'
import {queryStringForArray} from 'helpers/apiHelpers'
import {stringIsEmpty} from 'helpers/stringHelpers'
import {Color} from 'constants/css'

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
    const {fetchUsers} = this.props
    addEvent(window, 'scroll', this.onScroll)
    return fetchUsers().then(
      () => this.setState({loaded: true})
    )
  }

  componentWillUnmount() {
    const {clearUserSearch} = this.props
    clearUserSearch()
    removeEvent(window, 'scroll', this.onScroll)
  }

  render() {
    const {userId, loadMoreButton, profiles, searchedProfiles} = this.props
    const {loading, loaded, searching, searchText} = this.state
    return (
      <div>
        <SearchInput
          addonColor={Color.orange}
          placeholder="Search for users"
          onChange={this.onPeopleSearch}
          value={searchText}
        />
        <div style={{marginTop: '1em'}}>
          {!loaded &&
            <Loading text="Loading Users..." />
          }
          {loaded && !searching &&
            profiles.map(
              profile => <ProfilePanel expandable key={profile.id} userId={userId} profile={profile} />
            )
          }
          {searching &&
            searchedProfiles.map(
              profile => <ProfilePanel expandable key={profile.id} userId={userId} profile={profile} />
            )
          }
        </div>
        {!searching && loaded && loadMoreButton &&
          <LoadMoreButton onClick={this.loadMoreProfiles} loading={loading} />
        }
      </div>
    )
  }

  loadMoreProfiles = () => {
    const {fetchMoreUsers, profiles} = this.props
    const {loading} = this.state
    if (!loading) {
      this.setState({loading: true})
      return fetchMoreUsers(queryStringForArray(profiles, 'id', 'shownUsers')).then(
        () => this.setState({loading: false})
      )
    }
  }

  onPeopleSearch = (text) => {
    const {searchUsers, clearUserSearch} = this.props
    window.clearTimeout(this.timer)
    this.setState({searchText: text, searching: !stringIsEmpty(text)})
    if (stringIsEmpty(text)) {
      return clearUserSearch()
    }
    this.timer = setTimeout(() => searchUsers(text), 300)
  }

  onScroll = () => {
    const {chatMode, profiles} = this.props
    if (document.body.scrollHeight > this.scrollHeight) {
      this.scrollHeight = document.body.scrollHeight
    }
    const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop
    if (!chatMode && profiles.length > 0 && this.scrollHeight !== 0) {
      this.setState(() => ({scrollPosition}), () => {
        if (this.state.scrollPosition >= this.scrollHeight - window.innerHeight - 500) {
          this.loadMoreProfiles()
        }
      })
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
