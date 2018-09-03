import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import { Color } from 'constants/css';
import { addEmoji, finalizeEmoji, stringIsEmpty } from 'helpers/stringHelpers';
import Textarea from 'components/Texts/Textarea';

export default class QuestionModal extends Component {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    uploadAnswer: PropTypes.func.isRequired,
    question: PropTypes.string.isRequired
  };

  state = {
    answer: '',
    answerSubmitted: false
  };

  render() {
    const { onHide, question } = this.props;
    const { answer, answerSubmitted } = this.state;
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
            Question
          </span>
        </header>
        <main>
          <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            {question}
          </span>
          <Textarea
            autoFocus
            value={answer}
            onChange={event => this.setState({ answer: event.target.value })}
            onKeyUp={this.handleKeyUp}
            style={{ marginTop: '3rem' }}
            minRows={4}
            placeholder="Type your answer here..."
          />
        </main>
        <footer>
          <Button
            disabled={answerSubmitted || stringIsEmpty(answer)}
            success={answerSubmitted}
            primary={!answerSubmitted}
            onClick={this.onSubmit}
          >
            {answerSubmitted ? 'Answer Submitted!' : 'Submit'}
          </Button>
          <Button transparent onClick={onHide} style={{ marginRight: '1rem' }}>
            Cancel
          </Button>
        </footer>
      </Modal>
    );
  }

  handleKeyUp = event => {
    if (event.key === ' ') {
      this.setState({ answer: addEmoji(event.target.value) });
    }
  };

  onSubmit = async() => {
    const { onHide, parent, uploadAnswer } = this.props;
    const { answer } = this.state;
    await uploadAnswer({ content: finalizeEmoji(answer), parent });
    this.setState({ answerSubmitted: true });
    setTimeout(() => onHide(), 1000);
  };
}
