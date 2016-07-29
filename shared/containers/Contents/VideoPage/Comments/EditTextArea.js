import React, {Component} from 'react';
import Button from 'components/Button';
import Textarea from 'react-textarea-autosize';

export default class EditTextArea extends Component {
  constructor(props) {
    super()
    this.state = {
      editedText: props.text
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    return (
      <div>
        <Textarea
          autoFocus
          className="form-control"
          style={{
            marginTop: '1em'
          }}
          rows={4}
          value={this.state.editedText}
          onChange={event => this.setState({editedText: event.target.value})}
        />
        <div
          style={{
            marginTop: '1em'
          }}
        >
          <Button
            className="btn btn-default btn-sm"
            onClick={this.onSubmit}
          >
            Done
          </Button>
          <Button
            className="btn btn-default btn-sm"
            style={{
              marginLeft: '0.5em'
            }}
            onClick={() => this.props.onCancel()}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  onSubmit() {
    const {editedText} = this.state;
    this.props.onEditDone(editedText);
  }
}
