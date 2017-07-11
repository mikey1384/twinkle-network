import PropTypes from 'prop-types'
import React from 'react'
import {Modal, Button} from 'react-bootstrap'

ResultModal.propTypes = {
  onHide: PropTypes.func,
  totalQuestions: PropTypes.number,
  numberCorrect: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func
  ])
}
export default function ResultModal({numberCorrect, totalQuestions, onHide}) {
  const number = numberCorrect()
  const perfect = numberCorrect === totalQuestions
  return (
    <Modal show onHide={onHide} animation={false}>
      <Modal.Header closeButton>
        <h4>Your Results</h4>
      </Modal.Header>
      <Modal.Body>
        <p>{`You've correctly answered ${number} out of ${totalQuestions} question(s).`}</p>
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
