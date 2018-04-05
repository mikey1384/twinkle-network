import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Modal from 'components/Modal'
import Button from 'components/Button'
import {
  searchUserToInvite,
  clearUserSearchResults
} from 'redux/actions/ChatActions'
import { connect } from 'react-redux'
import TagPeopleForm from 'components/TagPeopleForm'
import Input from 'components/Texts/Input'

class CreateNewChannelModal extends Component {
  static propTypes = {
    clearSearchResults: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    userId: PropTypes.number.isRequired,
    searchResults: PropTypes.array.isRequired,
    searchUserToInvite: PropTypes.func.isRequired
  }

  state = {
    channelName: '',
    selectedUsers: []
  }

  render() {
    const {
      userId,
      onHide,
      clearSearchResults,
      searchUserToInvite,
      searchResults
    } = this.props
    const { channelName, selectedUsers } = this.state
    return (
      <Modal onHide={this.props.onHide}>
        <header>New Chat</header>
        <main>
          <TagPeopleForm
            searchResults={searchResults}
            filter={result => result.id !== userId}
            onSearch={searchUserToInvite}
            onClear={clearSearchResults}
            channelName={channelName}
            selectedUsers={selectedUsers}
            onAddUser={this.onAddUser}
            onRemoveUser={this.onRemoveUser}
          >
            {selectedUsers.length > 1 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3>Channel name</h3>
                <Input
                  style={{ marginTop: '1rem' }}
                  placeholder="Enter channel name"
                  value={channelName}
                  onChange={text => this.onChannelNameInput(text)}
                />
              </div>
            )}
          </TagPeopleForm>
        </main>
        <footer>
          <Button
            primary
            onClick={this.onDone}
            disabled={
              (selectedUsers.length > 1 && !channelName) ||
              selectedUsers.length === 0
            }
          >
            Create
          </Button>
          <Button style={{ marginRight: '1rem' }} transparent onClick={onHide}>
            Cancel
          </Button>
        </footer>
      </Modal>
    )
  }

  onAddUser = user => {
    const { selectedUsers } = this.state
    this.setState({
      selectedUsers: selectedUsers.concat([
        {
          userId: user.id,
          username: user.username
        }
      ])
    })
  }

  onRemoveUser = user => {
    const { selectedUsers } = this.state
    this.setState({
      selectedUsers: selectedUsers.filter(
        selectedUser => selectedUser.userId !== user.userId
      )
    })
  }

  onChannelNameInput = value => {
    this.setState({ channelName: value })
  }

  onDone = () => {
    const { userId } = this.props
    const { channelName, selectedUsers } = this.state
    this.props.onDone({ userId, channelName, selectedUsers })
  }
}

export default connect(
  state => ({
    searchResults: state.ChatReducer.userSearchResults
  }),
  {
    clearSearchResults: clearUserSearchResults,
    searchUserToInvite
  }
)(CreateNewChannelModal)
