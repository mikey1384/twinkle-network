import React, {Component} from 'react';
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
          <button
            className="btn btn-default btn-sm"
            onClick={this.onSubmit}
          >
            Done
          </button>
          <button
            className="btn btn-default btn-sm"
            style={{
              marginLeft: '0.5em'
            }}
            onClick={() => this.props.onCancel()}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  onSubmit() {
    const {editedText} = this.state;
    this.props.onEditDone(editedText);
  }
}
