import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import TagPeopleForm from 'components/TagPeopleForm';
import {connect} from 'react-redux';
import {clearSearchResults, searchUserToInviteAsync} from 'redux/actions/ChatActions';


@connect(
  state => ({
    searchResult: state.ChatReducer.searchResult
  }),
  {
    clearSearchResults,
    searchUserToInvite: searchUserToInviteAsync
  }
)
export default class InviteUsersModal extends Component {
  render() {
    const {clearSearchResults, searchUserToInvite, searchResult, onHide, style, currentMembers, show} = this.props;
    const selectedUsers = [];
    const currentMembersUID = currentMembers.map(member => member.userid);
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
            numSelected={selectedUsers.length}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  onAddUser() {
    console.log("on add user");
  }

  onRemoveUser() {
    console.log("on remove user");
  }


}
