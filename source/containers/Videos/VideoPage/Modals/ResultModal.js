import PropTypes from 'prop-types'
import React from 'react'
import Modal from 'components/Modal'
import Button from 'components/Button'

ResultModal.propTypes = {
  numberCorrect: PropTypes.oneOfType([PropTypes.number, PropTypes.func])
    .isRequired,
  onHide: PropTypes.func.isRequired,
  totalQuestions: PropTypes.number.isRequired
}
export default function ResultModal({ numberCorrect, totalQuestions, onHide }) {
  const number = numberCorrect()
  const perfect = numberCorrect === totalQuestions
  return (
    <Modal onHide={onHide}>
      <header>Your Results</header>
      <main>
        <p
        >{`You've correctly answered ${number} out of ${totalQuestions} question(s).`}</p>
        {perfect && <p>Perfect :)</p>}
      </main>
      <footer>
        <Button transparent onClick={onHide}>
          Close
        </Button>
      </footer>
    </Modal>
  )
}
