import React, {Component} from 'react'
import PropTypes from 'prop-types'
// import SearchInput from 'components/SearchInput'
import {connect} from 'react-redux'
import {fetchUsers, fetchMoreUsers} from 'redux/actions/UserActions'
import ProfileCard from '../ProfileCard'
import LoadMoreButton from 'components/LoadMoreButton'
import Loading from 'components/Loading'
import {addEvent, removeEvent} from 'helpers/listenerHelpers'
import {queryStringForArray} from 'helpers/apiHelpers'

@connect(
  state => ({
    chatMode: state.ChatReducer.chatMode,
    userId: state.UserReducer.userId,
    profiles: state.UserReducer.profiles,
    loadMoreButton: state.UserReducer.loadMoreButton
  }),
  {fetchUsers, fetchMoreUsers}
)
export default class People extends Component {
  static propTypes = {
    chatMode: PropTypes.bool,
    fetchUsers: PropTypes.func,
    fetchMoreUsers: PropTypes.func,
    userId: PropTypes.number,
    profiles: PropTypes.array,
    loadMoreButton: PropTypes.bool
  }

  constructor() {
    super()
    this.state = {
      searchText: '',
      loading: false,
      loaded: false
    }
    this.loadMoreProfiles = this.loadMoreProfiles.bind(this)
    this.onPeopleSearch = this.onPeopleSearch.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.onSelect = this.onSelect.bind(this)
  }

  componentDidMount() {
    const {fetchUsers} = this.props
    addEvent(window, 'scroll', this.onScroll)
    return fetchUsers().then(
      () => this.setState({loaded: true})
    )
  }

  componentWillUnmount() {
    removeEvent(window, 'scroll', this.onScroll)
  }

  render() {
    const {userId, profiles, loadMoreButton} = this.props
    const {loading, loaded} = this.state
    return (
      <div>
        {/* <SearchInput
          placeholder="Search for users"
          onChange={this.onPeopleSearch}
          value={searchText}
          searchResults={[]}
          renderItemLabel={
            item => item
          }
          onClickOutSide={() => {
            this.setState({searchText: ''})
          }}
          onSelect={this.onSelect}
        /> */}
        <div style={{marginTop: '1em'}}>
          {!loaded &&
            <Loading text="Loading Users..." />
          }
          {loaded &&
            profiles.map(
              profile => <ProfileCard expandable key={profile.id} userId={userId} profile={profile} />
            )
          }
        </div>
        {loaded && loadMoreButton && <LoadMoreButton onClick={this.loadMoreProfiles} loading={loading} />}
      </div>
    )
  }

  loadMoreProfiles() {
    const {fetchMoreUsers, profiles} = this.props
    const {loading} = this.state
    if (!loading) {
      this.setState({loading: true})
      return fetchMoreUsers(queryStringForArray(profiles, 'id', 'shownUsers')).then(
        () => this.setState({loading: false})
      )
    }
  }

  onPeopleSearch(event) {
    this.setState({searchText: event.target.value})
  }

  onScroll() {
    let {chatMode, profiles} = this.props
    if (!chatMode && profiles.length > 0) {
      this.setState({scrollPosition: document.body.scrollTop})
      if (this.state.scrollPosition >= (document.body.scrollHeight - window.innerHeight) * 0.7) {
        this.loadMoreProfiles()
      }
    }
  }

  onSelect() {
    console.log('selected')
  }
}
