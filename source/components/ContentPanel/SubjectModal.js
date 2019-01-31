import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import { Color } from 'constants/css';
import { addEmoji, finalizeEmoji, stringIsEmpty } from 'helpers/stringHelpers';
import Textarea from 'components/Texts/Textarea';

export default class SubjectModal extends Component {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    uploadResponse: PropTypes.func.isRequired,
    subject: PropTypes.object.isRequired
  };

  state = {
    answer: '',
    answerSubmitted: false
  };

  render() {
    const { onHide, subject } = this.props;
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
            Submit your response
          </span>
        </header>
        <main>
          <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            {subject.title}
          </span>
          <Textarea
            autoFocus
            value={answer}
            onChange={event => this.setState({ answer: event.target.value })}
            onKeyUp={this.handleKeyUp}
            style={{ marginTop: '3rem' }}
            minRows={4}
            placeholder="Type your response here..."
          />
        </main>
        <footer>
          <Button
            transparent
            onClick={onHide}
            style={{ marginRight: '0.7rem' }}
          >
            Cancel
          </Button>
          <Button
            disabled={answerSubmitted || stringIsEmpty(answer)}
            success={answerSubmitted}
            primary={!answerSubmitted}
            onClick={this.onSubmit}
          >
            {answerSubmitted ? 'Response Submitted!' : 'Submit'}
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
    const { onHide, subject, uploadResponse } = this.props;
    const { answer } = this.state;
    await uploadResponse({ content: finalizeEmoji(answer), subject });
    this.setState({ answerSubmitted: true });
    setTimeout(() => onHide(), 1000);
  };
}
