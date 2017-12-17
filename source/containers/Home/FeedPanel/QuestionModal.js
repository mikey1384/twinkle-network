import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import Button from 'components/Button'
import { Color } from 'constants/css'
import { addEmoji, finalizeEmoji, stringIsEmpty } from 'helpers/stringHelpers'
import Textarea from 'react-textarea-autosize'
import { uploadFeedComment } from 'redux/actions/FeedActions'
import { connect } from 'react-redux'

class QuestionModal extends Component {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    uploadAnswer: PropTypes.func.isRequired,
    question: PropTypes.string.isRequired
  }

  constructor() {
    super()
    this.state = {
      answer: '',
      answerSubmitted: false
    }
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    const { onHide, question } = this.props
    const { answer, answerSubmitted } = this.state
    return (
      <Modal show onHide={onHide} animation={false}>
        <Modal.Header>
          <span
            style={{
              color: Color.green,
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}
          >
            Question
          </span>
        </Modal.Header>
        <Modal.Body>
          <span style={{ fontSize: '2.5rem' }}>{question}</span>
          <Textarea
            autoFocus
            value={answer}
            onChange={event => this.setState({ answer: event.target.value })}
            onKeyUp={this.handleKeyUp}
            style={{ marginTop: '1em' }}
            className="form-control"
            minRows={4}
            placeholder="Type your answer here..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-default" onClick={onHide}>
            Cancel
          </Button>
          <Button
            disabled={answerSubmitted || stringIsEmpty(answer)}
            className={`btn ${answerSubmitted ? 'btn-success' : 'btn-primary'}`}
            onClick={this.onSubmit}
          >
            {answerSubmitted ? 'Answer Submitted!' : 'Submit'}
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  handleKeyUp(event) {
    if (event.key === ' ') { this.setState({ answer: addEmoji(event.target.value) }) }
  }

  async onSubmit() {
    const { onHide, parent, uploadAnswer } = this.props
    const { answer } = this.state
    await uploadAnswer(finalizeEmoji(answer), parent)
    this.setState({ answerSubmitted: true })
    setTimeout(() => onHide(), 1000)
  }
}

export default connect(null, { uploadAnswer: uploadFeedComment })(QuestionModal)
