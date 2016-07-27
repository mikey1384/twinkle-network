import React, {Component} from 'react';
import Textarea from 'react-textarea-autosize';
import {reduxForm, Field} from 'redux-form';
import {Modal, Button} from 'react-bootstrap';
import {uploadVideoAsync} from 'redux/actions/VideoActions';
import {connect} from 'react-redux';


const renderInput = field => (
  <div style={{display: 'inline'}}>
    <input {...field.input} />
    <span
      className="help-block"
      style={{color: 'red'}}
    >{field.touched && field.error && field.error}</span>
  </div>
)

const renderTextarea = field => <Textarea {...field.input} />

@reduxForm({
  form: 'UploadVideoForm',
  validate
})
@connect(
  null,
  {uploadVideo: uploadVideoAsync}
)
export default class AddVideoForm extends Component {
  constructor() {
    super()
    this.onSubmit = this.onSubmit.bind(this)
  }

  render () {
    const {handleSubmit} = this.props;
    return (
      <form className="container-fluid" onSubmit={handleSubmit(this.onSubmit)} >
        <fieldset className="form-group">
          <label>Video Url</label>
          <Field
            name="url"
            placeholder="Paste video's YouTube url here"
            className="form-control"
            component={renderInput}
            type="text"
          />
        </fieldset>
        <fieldset className="form-group">
          <label>Title</label>
          <Field
            name="title"
            placeholder="Enter Title"
            className="form-control"
            component={renderInput}
            type="text"
          />
        </fieldset>
        <fieldset className="form-group">
          <label>Description</label>
          <Field
            name="description"
            className="form-control"
            minRows={4}
            placeholder="Enter Description (Optional)"
            component={renderTextarea}
          />
        </fieldset>
        <Modal.Footer>
          <Button bsStyle="primary" type="submit">Add</Button>
        </Modal.Footer>
      </form>
    )
  }

  onSubmit(props) {
    this.props.uploadVideo(props)
  }
}

function validate (values) {
  const {url, title} = values;
  const errors = {};

  if ((title && containsOnlySpaces(title)) || !title) {
    errors.title = 'Enter title';
  }
  if (url && !isValidYoutubeUrl(url)) {
    errors.url = 'That is not a valid YouTube url';
  }
  if (!url) {
    errors.url = 'Enter url';
  }

  return errors;
}

function isValidYoutubeUrl (url) {
  var trimmedUrl = url.split("v=")[1];
  return typeof trimmedUrl !== "undefined";
}

function containsOnlySpaces (string) {
  return string.replace(/\s/g, "").replace(/\r?\n/g, "") === "";
}
