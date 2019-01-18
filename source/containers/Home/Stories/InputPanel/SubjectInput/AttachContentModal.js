import React, { Component } from 'react';
import Modal from 'components/Modal';

export default class AttachContentModal extends Component {
  render() {
    return (
      <Modal>
        <header>Header</header>
        <main>Body</main>
        <footer>Footer</footer>
      </Modal>
    );
  }
}
