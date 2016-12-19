import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ProfilePic from 'components/ProfilePic';
import Button from 'components/Button';
import ImageEditModal from './Modals/ImageEditModal';
import {uploadProfilePic} from 'redux/actions/UserActions';
import {connect} from 'react-redux';


@connect(
  null,
  {uploadProfilePic}
)
export default class Header extends Component {
  constructor() {
    super()
    this.state = {
      imageUri: null,
      processing: false,
      imageEditModalShown: false
    }
    this.onChangeProfilePictureClick = this.onChangeProfilePictureClick.bind(this)
    this.handlePicture = this.handlePicture.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  render() {
    const {imageUri, imageEditModalShown, processing} = this.state;
    const {userId, profilePicId} = this.props;
    return (
      <div
        className="panel panel-default"
        style={{borderTop: '#e7e7e7 1px solid'}}
      >
        <div className="panel-body">
          <div
            className="media"
            style={{
              height: 'auto',
              width: '100%'
            }}
          >
            <ProfilePic
              userId={userId}
              profilePicId={profilePicId}
              size='13'
            />
            <div className="media-body" style={{paddingLeft: '1em'}}>
              <h2 className="media-heading">mikey <small>(Mikey Lee)</small></h2>
              <p style={{marginBottom: '0px'}}>Teacher, Programmer, Creator of Twinkle Website</p>
              <p style={{marginBottom: '0px'}}>Likes to learn, teach and create</p>
              <p style={{marginBottom: '0px'}}>Born on January 3, 1984</p>
              <Button className="btn btn-sm btn-default" style={{marginTop: '0.5em'}}>Edit Bio</Button><br/>
              <Button
                className="btn btn-sm btn-default" style={{marginTop: '0.5em'}}
                onClick={this.onChangeProfilePictureClick}
              >
                Change Profile Picture
              </Button>
            </div>
            <input
              ref={ref => this.fileInput = ref}
              style={{display: 'none'}}
              type="file"
              onChange={this.handlePicture}
              accept="image/*"
            />
          </div>
        </div>
        {imageEditModalShown &&
          <ImageEditModal
            imageUri={imageUri}
            onHide={() => {
              this.setState({
                imageUri: null,
                imageEditModalShown: false,
                processing: false
              })
            }}
            processing={processing}
            onConfirm={this.handleSubmit}
          />
        }
      </div>
    )
  }

  onChangeProfilePictureClick() {
    ReactDOM.findDOMNode(this.fileInput).click()
  }

  handlePicture(event) {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = (upload) => {
      this.setState({
        imageEditModalShown: true,
        imageUri: upload.target.result
      });
    };

    reader.readAsDataURL(file);
    event.target.value = null;
  }

  handleSubmit(image) {
    const {uploadProfilePic} = this.props;

    this.setState({
      imageUri: null,
      processing: true
    });

    uploadProfilePic(image, () => {
      this.setState({
        processing: false,
        imageEditModalShown: false
      });
    })
  }
}

/*
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {uploadProfilePic} from 'redux/actions/ProfileActions';

@connect(
  null,
  {uploadProfilePic}
)
export default class Profile extends Component {
  constructor() {
    super()
    this.state = {
      dataUri: null,
      processing: false
    }

    this.handleFile = this.handleFile.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  render() {
    let processing;
    let uploaded;

    if (this.state.uploaded_uri) {
      uploaded = (
        <div>
          <h4>Image uploaded!</h4>
          <img className='image-preview' src={this.state.uploaded_uri} />
          <pre className='image-link-box'>{this.state.uploaded_uri}</pre>
        </div>
      );
    }

    if (this.state.processing) {
      processing = "Processing image, hang tight";
    }

    return (
      <div className='row'>
        <div className='col-sm-12'>
          <label>Upload an image</label>
          <form onSubmit={this.handleSubmit} encType="multipart/form-data">
            <input type="file" onChange={this.handleFile} />
            <input disabled={this.state.processing} className='btn btn-primary' type="submit" value="Upload" />
            {processing}
          </form>
          {uploaded}
        </div>
      </div>
    );
  }




}

*/
