import React, {Component} from 'react';
import Textarea from 'react-textarea-autosize';
import {reduxForm, Field} from 'redux-form';
import {Modal} from 'react-bootstrap';
import Button from 'components/Button';
import {uploadVideoAsync} from 'redux/actions/VideoActions';
import {connect} from 'react-redux';
import {isValidYoutubeUrl} from 'helpers/stringHelpers';


const renderInput = ({input, type, className, placeholder, meta: {touched, error}}) => (
  <div style={{display: 'inline'}}>
    <input
      {...input}
      className={className}
      placeholder={placeholder}
      type={type}
    />
    <span
      className="help-block"
      style={{color: 'red'}}
    >{touched && error && error}</span>
  </div>
)

const renderTextarea = ({input, className, minRows, placeholder}) =>
<Textarea
  {...input}
  className={className}
  minRows={minRows}
  placeholder={placeholder}
/>

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
          <Button className="btn btn-primary" type="submit">Add</Button>
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

function containsOnlySpaces (string) {
  return string.replace(/\s/g, "").replace(/\r?\n/g, "") === "";
}
