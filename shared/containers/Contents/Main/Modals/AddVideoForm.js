import React, {Component} from 'react';
import Textarea from 'react-textarea-autosize';
import {reduxForm} from 'redux-form';
import {Modal, Button} from 'react-bootstrap';
import {uploadVideoAsync} from 'redux/actions/VideoActions';
import {connect} from 'react-redux';


@reduxForm({
  form: 'UploadVideoForm',
  fields: ['url', 'title', 'description'],
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
    const {fields: {url, title, description}, handleSubmit} = this.props;
    let urlError = url.touched && url.invalid;
    let titleError = title.touched && title.invalid;
    return (
      <form className="container-fluid" onSubmit={handleSubmit(this.onSubmit)} >
        <div className={`form-group ${urlError ? 'has-error' : ''}`}>
          <label>Video Url</label>
          <input type="text" className="form-control" placeholder="Paste video's YouTube url here" {...url} />
          <span className="help-block">
            {urlError ? url.error : ''}
          </span>
        </div>
        <div className={`form-group ${titleError ? 'has-error' : ''}`}>
          <label>Title</label>
          <input type="text" className="form-control" placeholder="Enter Title" {...title} />
          <span className="help-block">
            {titleError ? title.error : ''}
          </span>
        </div>
        <div className="form-group">
          <label>Description</label>
          <Textarea
            className="form-control"
            minRows={4}
            placeholder="Enter Description (Optional)"
            {...description}
          >
          </Textarea>
        </div>
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
