import React, {Component} from 'react';
import { Modal, Button } from 'react-bootstrap';

export default class ResultModal extends Component {
  render() {
    const numberCorrect = this.props.numberCorrect();
    const { totalQuestions } = this.props;
    const perfect = numberCorrect === totalQuestions ? true : false;
    return (
      <Modal {...this.props} animation={false}>
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
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
