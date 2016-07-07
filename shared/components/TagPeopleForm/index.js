import React, {Component} from 'react';
import {connect} from 'react-redux';
import {stringIsEmpty} from 'helpers/StringHelper';
import TagPeopleInput from './Input';


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
    const {onClear} = this.props;
    onClear()
  }

  render() {
    const {
      numSelected,
      searchResult,
      userId,
      onChange,
      onClear,
      channelName,
      selectedUsers,
      filter } = this.props;
    const {searchText} = this.state;
    const filteredResults = searchResult.filter(filter);
    return (
      <form onSubmit={event => event.preventDefault()}>
        <div className="form-group">
          <label>People</label>
          {this.renderTags()}
          <TagPeopleInput
            value={searchText}
            onChange={this.onUserSearch}
            onClickOutSide={() => {
              this.setState({searchText: ''})
              onClear()
            }}
            searchResults={filteredResults}
            selectedUsers={selectedUsers}
            onAddUser={this.onAddUser}
          />
        </div>
        { numSelected > 1 &&
          <div className="form-group">
            <label>Channel name</label>
            <input
              className="form-control"
              placeholder="Enter channel name"
              value={channelName}
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
    const {onSearch, onClear} = this.props;
    const text = event.target.value;
    this.setState({searchText: text})
    if (stringIsEmpty(text)) {
      return onClear()
    }
    onSearch(text)
  }

  onAddUser(user) {
    this.setState({searchText: ''})
    this.props.onAddUser(user)
    this.props.onClear()
  }
}
