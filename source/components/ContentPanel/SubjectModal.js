import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import { Color } from 'constants/css';
import { addEmoji, finalizeEmoji, stringIsEmpty } from 'helpers/stringHelpers';
import Textarea from 'components/Texts/Textarea';

SubjectModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  uploadResponse: PropTypes.func.isRequired,
  subject: PropTypes.object.isRequired
};

export default function SubjectModal({ onHide, subject, uploadResponse }) {
  const [response, setResponse] = useState('');
  const [responseSubmitted, setResponseSubmitted] = useState(false);
  return (
    <Modal onHide={onHide}>
      <header>
        <span
          style={{
            color: Color.green(),
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}
        >
          Submit your response
        </span>
      </header>
      <main>
        <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          {subject.title}
        </span>
        <Textarea
          autoFocus
          value={response}
          onChange={event => setResponse(event.target.value)}
          onKeyUp={handleKeyUp}
          style={{ marginTop: '3rem' }}
          minRows={4}
          placeholder="Type your response here..."
        />
      </main>
      <footer>
        <Button transparent onClick={onHide} style={{ marginRight: '0.7rem' }}>
          Cancel
        </Button>
        <Button
          disabled={responseSubmitted || stringIsEmpty(response)}
          success={responseSubmitted}
          primary={!responseSubmitted}
          onClick={onSubmit}
        >
          {responseSubmitted ? 'Response Submitted!' : 'Submit'}
        </Button>
      </footer>
    </Modal>
  );

  function handleKeyUp(event) {
    if (event.key === ' ') {
      setResponse(addEmoji(event.target.value));
    }
  }

  async function onSubmit() {
    await uploadResponse({ content: finalizeEmoji(response), subject });
    setResponseSubmitted(true);
    setTimeout(() => onHide(), 1000);
  }
}
