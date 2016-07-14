import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import TagPeopleForm from 'components/TagPeopleForm';
import {connect} from 'react-redux';
import {clearSearchResults, searchUserToInviteAsync, inviteUsersToChannelAsync} from 'redux/actions/ChatActions';


@connect(
  state => ({
    searchResult: state.ChatReducer.searchResult
  }),
  {
    clearSearchResults,
    searchUserToInvite: searchUserToInviteAsync,
    inviteUsersToChannel: inviteUsersToChannelAsync
  }
)
export default class InviteUsersModal extends Component {
  constructor() {
    super()
    this.state = {
      selectedUsers: []
    }
    this.onAddUser = this.onAddUser.bind(this)
    this.onRemoveUser = this.onRemoveUser.bind(this)
    this.onDone = this.onDone.bind(this)
  }

  render() {
    const {clearSearchResults, searchUserToInvite, searchResult, onHide, style, currentChannel, show} = this.props;
    const {selectedUsers} = this.state;
    const currentMembersUID = currentChannel.members.map(member => member.userid);
    return (
      <Modal
        show={show}
        style={style}
        onHide={onHide}
        animation={false}
      >
        <Modal.Header closeButton>
          <h4>Invite people to this channel</h4>
        </Modal.Header>
        <Modal.Body>
          <TagPeopleForm
            searchResult={searchResult}
            filter={result => currentMembersUID.indexOf(result.id) === -1}
            onSearch={searchUserToInvite}
            onClear={clearSearchResults}
            selectedUsers={selectedUsers}
            onAddUser={this.onAddUser}
            onRemoveUser={this.onRemoveUser}
            onSubmit={selectedUsers.length > 0 && this.onDone}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Cancel</Button>
          <Button
            bsStyle="primary"
            onClick={this.onDone}
            disabled={selectedUsers.length === 0}
          >Invite</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  onAddUser(user) {
    const {selectedUsers} = this.state;
    this.setState({
      selectedUsers: selectedUsers.concat([{
        userId: user.id,
        username: user.username
      }])
    })
  }

  onRemoveUser(user) {
    const {selectedUsers} = this.state;
    this.setState({
      selectedUsers: selectedUsers.filter(selectedUser => selectedUser.userId !== user.userId)
    })
  }

  onDone() {
    const {inviteUsersToChannel, currentChannel, onDone} = this.props;
    const {selectedUsers} = this.state;
    inviteUsersToChannel({selectedUsers, channelId: currentChannel.id}, message => {
      onDone(selectedUsers.map(user => user.userId), message)
    })
  }
}
