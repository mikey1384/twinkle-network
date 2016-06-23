import React, {Component} from 'react';
import {connect} from 'react-redux';
import {searchUserToInviteAsync, clearSearchResults} from 'redux/actions/ChatActions';
import {stringIsEmpty} from 'helpers/StringHelper';
import InvitePeopleInput from './InvitePeopleInput';

@connect(
  state => ({
    searchResult: state.ChatReducer.searchResult
  }),
  {
    clearSearchResults,
    searchUserToInvite: searchUserToInviteAsync
  }
)
export default class CreateNewChannelForm extends Component {
  constructor() {
    super()
    this.state={
      searchText: ''
    }
    this.onUserSearch = this.onUserSearch.bind(this)
    this.onAddUser = this.onAddUser.bind(this)
  }

  componentWillUnmount() {
    const {clearSearchResults} = this.props;
    clearSearchResults()
  }

  render() {
    const {numSelected, searchResult, userId, onChange, clearSearchResults} = this.props;
    const {searchText} = this.state;
    const filteredResults = searchResult.filter(result => {
      return result.id !== userId
    })
    return (
      <form onSubmit={event => event.preventDefault()}>
        <div className="form-group">
          <label>People</label>
          {this.renderTags()}
          <InvitePeopleInput
            value={searchText}
            onChange={this.onUserSearch}
            onClickOutSide={() => {
              this.setState({searchText: ''})
              clearSearchResults()
            }}
            searchResults={filteredResults}
            selectedUsers={this.props.selectedUsers}
            onAddUser={this.onAddUser}
          />
        </div>
        { numSelected > 1 &&
          <div className="form-group">
            <label>Channel name</label>
            <input
              className="form-control"
              placeholder="Enter channel name"
              value={this.props.channelName}
              onChange={event => onChange(event.target.value)}
            />
          </div>
        }
      </form>
    )
  }

  renderTags() {
    const {selectedUsers, onRemoveUser} = this.props;
    return selectedUsers.length > 0 ?
    <div
      style={{
        marginBottom: '0.5em'
      }}
    >
      {selectedUsers.map((user, index) => {
        return <span
          key={index}
          style={{
            marginLeft: index > 0 && '0.2em',
            backgroundColor: '#18aae0',
            color: '#fff',
            paddingTop: '3px',
            paddingBottom: '3px',
            paddingLeft: '8px',
            paddingRight: '8px',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
          onClick={() => onRemoveUser(user)}
        >{user.username} &times;</span>
      })}
    </div> : null
  }

  onUserSearch(event) {
    const {searchUserToInvite, clearSearchResults} = this.props;
    const text = event.target.value;
    this.setState({searchText: text})
    if (stringIsEmpty(text)) {
      return clearSearchResults()
    }
    searchUserToInvite(text)
  }

  onAddUser(user) {
    this.setState({searchText: ''})
    this.props.onAddUser(user)
    this.props.clearSearchResults()
  }
}
