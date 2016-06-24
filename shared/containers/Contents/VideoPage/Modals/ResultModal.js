import React from 'react';
import {Modal, Button} from 'react-bootstrap';

export default function ResultModal(props) {
  const numberCorrect = props.numberCorrect();
  const {totalQuestions, onHide} = props;
  const perfect = numberCorrect === totalQuestions;
  return (
    <Modal {...props} animation={false}>
      <Modal.Header closeButton>
        <h4>Your Results</h4>
      </Modal.Header>
      <Modal.Body>
        <p>You've correctly answered {numberCorrect} out of {totalQuestions} question(s).</p>
        { perfect &&
          <p>Perfect :)</p>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}
