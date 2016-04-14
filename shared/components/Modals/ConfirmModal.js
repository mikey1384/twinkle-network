import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

class ConfirmModal extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  }

  onConfirm () {
    const { store } = this.context;
    this.props.onConfirm();
    store.subscribe(() => this.props.onHide);
  }

  render () {
    return (
      <Modal {...this.props} animation={false}>
        <Modal.Header closeButton>
          <h4>{this.props.title}</h4>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Cancel</Button>
          <Button bsStyle="primary" onClick={this.onConfirm.bind(this)}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default ConfirmModal;
