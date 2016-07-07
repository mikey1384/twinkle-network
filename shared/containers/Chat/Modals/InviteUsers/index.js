import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import TagPeopleForm from 'components/TagPeopleForm';
import {connect} from 'react-redux';
import {clearSearchResults} from 'redux/actions/ChatActions';


@connect(
  state => ({
    searchResult: state.ChatReducer.searchResult
  }),
  {
    clearSearchResults
  }
)
export default class InviteUsersModal extends Component {
  render() {
    const {clearSearchResults, userId, searchResult, onHide} = this.props;
    const selectedUsers = [];
    return (
      <Modal
        {...this.props}
        animation={false}
      >
        <Modal.Header closeButton>
          <h4>Invite people to this channel</h4>
        </Modal.Header>
        <Modal.Body>
          <TagPeopleForm
            searchResult={searchResult}
            filter={result => result.id !== userId}
            onSearch={this.onSearch}
            onClear={clearSearchResults}
            selectedUsers={selectedUsers}
            onAddUser={this.onAddUser}
            onRemoveUser={this.onRemoveUser}
            userId={userId}
            numSelected={selectedUsers.length}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  onSearch() {
    console.log("on search")
  }

  onAddUser() {
    console.log("on add user");
  }

  onRemoveUser() {
    console.log("on remove user");
  }


}
