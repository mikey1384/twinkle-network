import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import listensToClickOutside from 'react-onclickoutside/decorator';
import ReactDOM from 'react-dom';

class EditTitleForm extends Component {
  componentDidMount () {
    this.refs.editTitleInput.value = this.props.value;
    ReactDOM.findDOMNode(this.refs.editTitleInput).focus();
  }

  handleClickOutside = (event) => {
    this.props.onEditCancel();
  }

  onEditSubmit(props) {
    this.props.onEditSubmit(props);
  }

  render () {
    const { fields: { editedTitle }, handleSubmit } = this.props;
    return (
      <form onSubmit={ handleSubmit(this.onEditSubmit.bind(this)) }>
        <input
          ref="editTitleInput"
          type="text"
          className="form-control"
          placeholder="Enter Title..."
          { ...editedTitle }
        />
      </form>
    )
  }
}

EditTitleForm = reduxForm({
  form: 'EditTitleForm',
  fields: ['editedTitle']
})(listensToClickOutside(EditTitleForm));

export default EditTitleForm;
