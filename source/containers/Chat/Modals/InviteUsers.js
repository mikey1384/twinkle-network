import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Modal from 'components/Modal';
import Button from 'components/Button';
import TagForm from 'components/TagForm';
import { connect } from 'react-redux';
import {
  clearUserSearchResults,
  searchUserToInvite,
  inviteUsersToChannel
} from 'redux/actions/ChatActions';

class InviteUsersModal extends Component {
  static propTypes = {
    clearSearchResults: PropTypes.func.isRequired,
    currentChannel: PropTypes.object.isRequired,
    inviteUsersToChannel: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    searchResults: PropTypes.array.isRequired,
    searchUserToInvite: PropTypes.func.isRequired
  };

  state = {
    selectedUsers: []
  };

  render() {
    const {
      clearSearchResults,
      searchUserToInvite,
      searchResults,
      onHide,
      currentChannel
    } = this.props;
    const { selectedUsers } = this.state;
    const currentMembersUID = currentChannel.members.map(
      member => member.userId
    );
    return (
      <Modal onHide={onHide}>
        <header>Invite people to this channel</header>
        <main>
          <TagForm
            title="People"
            itemLabel="username"
            searchResults={searchResults}
            filter={result => currentMembersUID.indexOf(result.id) === -1}
            onSearch={searchUserToInvite}
            onClear={clearSearchResults}
            onAddItem={this.onAddUser}
            onRemoveItem={this.onRemoveUser}
            onSubmit={selectedUsers.length > 0 && this.onDone}
            renderDropdownLabel={item => (
              <span>
                {item.username}{' '}
                {item.realName && <small>{`(${item.realName})`}</small>}
              </span>
            )}
            searchPlaceholder="Search for people you want to chat with"
            selectedItems={selectedUsers}
          />
        </main>
        <footer>
          <Button
            primary
            onClick={this.onDone}
            disabled={selectedUsers.length === 0}
          >
            Invite
          </Button>
          <Button transparent style={{ marginRight: '1rem' }} onClick={onHide}>
            Cancel
          </Button>
        </footer>
      </Modal>
    );
  }

  onAddUser = user => {
    const { selectedUsers } = this.state;
    this.setState({
      selectedUsers: selectedUsers.concat([user])
    });
  };

  onRemoveUser = userId => {
    this.setState(state => ({
      selectedUsers: state.selectedUsers.filter(
        selectedUser => selectedUser.id !== userId
      )
    }));
  };

  onDone = async() => {
    const { inviteUsersToChannel, currentChannel, onDone } = this.props;
    const { selectedUsers } = this.state;
    const message = await inviteUsersToChannel({
      selectedUsers,
      channelId: currentChannel.id
    });
    onDone(selectedUsers.map(user => user.id), message);
  };
}

export default connect(
  state => ({
    searchResults: state.ChatReducer.userSearchResults
  }),
  {
    clearSearchResults: clearUserSearchResults,
    searchUserToInvite,
    inviteUsersToChannel
  }
)(InviteUsersModal);
