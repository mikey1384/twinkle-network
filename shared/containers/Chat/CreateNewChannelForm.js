import React, { Component } from 'react';
import { connect } from 'react-redux';
import { searchUserToInviteAsync, clearSearchResults } from 'redux/actions/ChatActions';
import { stringIsEmpty } from 'helpers/StringHelper';

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
  constructor(props) {
    super()
    this.state = {
      selectedUsers: []
    }
  }

  componentWillUnmount() {
    const { clearSearchResults } = this.props;
    clearSearchResults()
  }

  render() {
    return (
      <form>
        <div className="form-group">
          <label>Name</label>
          <input className="form-control" placeholder="Enter channel name" />
          <small>Channel names should be lowercase, with no spaces.</small>
        </div>
        <div className="form-group">
          <label>Invite Members</label>
          { this.renderTags() }
          <div className="input-group dropdown">
            <span className="input-group-addon"><span className="glyphicon glyphicon-search"></span></span>
            <input
              className="form-control"
              placeholder="Invite people to this channel"
              onChange={ this.onUserSearch.bind(this) }
            />
            { this.renderDropdownList() }
          </div>
        </div>
      </form>
    )
  }

  renderTags() {
    const { selectedUsers } = this.state;
    return selectedUsers.length > 0 ?
    <div
      style={{marginBottom: '0.5em'}}
    >
      {
        selectedUsers.map((user, index) => {
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
            onClick={ (() => this.onRemoveUser(user)).bind(this) }
          >{user.username} &times;</span>
        })
      }
    </div> : null
  }

  renderDropdownList() {
    const { searchResult } = this.props;
    return searchResult.length > 0 ?
    <ul
      className="dropdown-menu"
      style={{
        width: '100%',
        cursor: 'pointer',
        display: 'block'
      }}
    >
      {
        searchResult.map((user, index) => {
          return (
            <li
              key={index}
              onClick={ () => this.onAddUser(user) }
            ><a>{user.realname} <small>{`(${user.username})`}</small></a></li>
          )
        })
      }
    </ul> : null
  }

  onUserSearch(event) {
    const { searchUserToInvite, clearSearchResults } = this.props;
    const text = event.target.value;
    if (stringIsEmpty(text)) {
      return clearSearchResults()
    }
    searchUserToInvite(text)
  }

  onAddUser(user) {
    this.setState({
      selectedUsers: this.state.selectedUsers.concat([{
        userId: user.id,
        username: user.username
      }])
    })
  }

  onRemoveUser(user) {
    const { selectedUsers } = this.state;
    this.setState({
      selectedUsers: selectedUsers.filter(selectedUser => {
        return selectedUser.userId === user.userId ? false : true
      })
    })
  }
}
