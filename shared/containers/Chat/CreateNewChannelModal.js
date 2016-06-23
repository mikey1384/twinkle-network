import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import CreateNewChannelForm from './CreateNewChannelForm';

export default class CreateNewChatModal extends Component {
  constructor() {
    super()
    this.state = {
      channelName: '',
      selectedUsers: []
    }
    this.onAddUser = this.onAddUser.bind(this)
    this.onRemoveUser = this.onRemoveUser.bind(this)
    this.onChannelNameInput = this.onChannelNameInput.bind(this)
    this.onDone = this.onDone.bind(this)
  }

  render() {
    const {userId, onHide} = this.props;
    const {channelName, selectedUsers} = this.state;
    return (
      <Modal
        {...this.props}
        animation={false}
      >
        <Modal.Header closeButton>
          <h4>New Chat</h4>
        </Modal.Header>
        <Modal.Body>
          <CreateNewChannelForm
            channelName={channelName}
            selectedUsers={selectedUsers}
            onAddUser={this.onAddUser}
            onRemoveUser={this.onRemoveUser}
            onChange={this.onChannelNameInput}
            userId={userId}
            numSelected={selectedUsers.length}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Cancel</Button>
          <Button
            bsStyle="primary"
            onClick={this.onDone}
            disabled={(selectedUsers.length > 1 && !channelName) || (selectedUsers.length === 0)}
          >Create</Button>
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
      selectedUsers: selectedUsers.filter(selectedUser => {
        return selectedUser.userId === user.userId ? false : true
      })
    })
  }

  onChannelNameInput(value) {
    this.setState({channelName: value})
  }

  onDone() {
    const {userId} = this.props;
    const {channelName, selectedUsers} = this.state;
    this.props.onDone({userId, channelName, selectedUsers})
  }
}
