import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import CreateNewChannelForm from './CreateNewChannelForm';

export default class CreateNewChatModal extends Component {
  state = {
    channelName: 'new channel'
  }
  render() {
    return (
      <Modal
        {...this.props}
        animation={false}
      >
        <Modal.Header closeButton>
          <h4>Create New Channel</h4>
        </Modal.Header>
        <Modal.Body>
          <CreateNewChannelForm />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Cancel</Button>
          <Button bsStyle="primary" onClick={this.onDone.bind(this)}>Create</Button>
        </Modal.Footer>
      </Modal>
    )
  }
  onDone() {
    console.log(this.state.channelName)
  }
}
