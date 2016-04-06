import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import listensToClickOutside from 'react-onclickoutside/decorator';
import { API_URL, editVideoTitle } from 'actions/VideoActions';
import ReactDOM from 'react-dom';

class EditThumbTitleForm extends Component {
  componentDidMount () {
    this.refs.editTitleInput.value = this.props.value;
    ReactDOM.findDOMNode(this.refs.editTitleInput).focus();
  }

  handleClickOutside = (event) => {
    this.props.onEditFinish();
  }

  onSubmit(props) {
    const { value, dispatch } = this.props;
    props['videoId'] = this.props.videoId;
    if (props.editedTitle && props.editedTitle !== value) {
      dispatch(editVideoTitle(props, this.props.arrayNumber));
      this.props.onEditFinish(props.editedTitle);
    } else {
      this.props.onEditFinish();
    }
  }

  render () {
    const { fields: { editedTitle }, handleSubmit } = this.props;
    return (
      <form onSubmit={ handleSubmit(this.onSubmit.bind(this)) }>
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

EditThumbTitleForm = reduxForm({
  form: 'EditVideoThumbTitleForm',
  fields: ['editedTitle']
})(listensToClickOutside(EditThumbTitleForm));

export default connect()(EditThumbTitleForm);
