import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import { edit } from 'constants/placeholders';

EditTitleModal.propTypes = {
  onDone: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string
};

export default function EditTitleModal({ onDone, onHide, ...props }) {
  const [title, setTitle] = useState(props.title);

  return (
    <Modal onHide={onHide}>
      <header>Edit Channel Name</header>
      <main>
        <form
          style={{ width: '50%' }}
          onSubmit={event => onSubmit(event, title)}
        >
          <Input
            autoFocus
            type="text"
            placeholder={edit.title}
            value={title}
            onChange={setTitle}
          />
        </form>
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button color="blue" onClick={() => onDone(title)}>
          Done
        </Button>
      </footer>
    </Modal>
  );

  function onSubmit(event, title) {
    event.preventDefault();
    onDone(title);
  }
}
