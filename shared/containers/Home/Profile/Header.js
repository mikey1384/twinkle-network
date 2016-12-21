import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ProfilePic from 'components/ProfilePic';
import Button from 'components/Button';
import ImageEditModal from './Modals/ImageEditModal';
import BioEditModal from './Modals/BioEditModal';
import {uploadProfilePic, uploadBio} from 'redux/actions/UserActions';
import {connect} from 'react-redux';
import {cleanStringWithURL} from 'helpers/stringHelpers';


@connect(
  null,
  {uploadProfilePic, uploadBio}
)
export default class Header extends Component {
  constructor() {
    super()
    this.state = {
      imageUri: null,
      processing: false,
      imageEditModalShown: false,
      bioEditModalShown: false
    }
    this.onChangeProfilePictureClick = this.onChangeProfilePictureClick.bind(this)
    this.handlePicture = this.handlePicture.bind(this)
    this.uploadBio = this.uploadBio.bind(this)
    this.uploadImage = this.uploadImage.bind(this)
  }

  render() {
    const {imageUri, imageEditModalShown, bioEditModalShown, processing} = this.state;
    const {profilePage, userId} = this.props;
    const {profileFirstRow, profileSecondRow, profileThirdRow} = profilePage;
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
              userId={profilePage.id}
              profilePicId={profilePage.profilePicId}
              size='13'
            />
            <div className="media-body" style={{paddingLeft: '1em'}}>
              <h2 className="media-heading">{profilePage.username} <small>{`(${profilePage.realName})`}</small></h2>
              {(!!profileFirstRow || !!profileSecondRow || !! profileThirdRow) &&
                <ul style={{paddingLeft: '1em'}}>
                  {!!profileFirstRow &&
                    <li style={{marginBottom: '0px'}} dangerouslySetInnerHTML={{__html: profileFirstRow}} />
                  }
                  {!!profileSecondRow &&
                    <li style={{marginBottom: '0px'}} dangerouslySetInnerHTML={{__html: profileSecondRow}} />
                  }
                  {!!profileThirdRow &&
                    <li style={{marginBottom: '0px'}} dangerouslySetInnerHTML={{__html: profileThirdRow}} />
                  }
                </ul>
              }
              {!profileFirstRow && !profileSecondRow && !profileThirdRow && userId === profilePage.id &&
                <p>**Add your bio so that your Twinkle friends can know you better</p>
              }
              {userId === profilePage.id &&
                <div>
                  <Button
                    className="btn btn-sm btn-default" style={{marginTop: '0.5em'}}
                    onClick={() => this.setState({bioEditModalShown: true})}
                  >
                    Edit Bio
                  </Button><br/>
                  <Button
                    className="btn btn-sm btn-default" style={{marginTop: '0.5em'}}
                    onClick={this.onChangeProfilePictureClick}
                  >
                    Change Profile Picture
                  </Button>
                </div>
              }
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
        {bioEditModalShown &&
          <BioEditModal
            firstLine={cleanStringWithURL(profileFirstRow)}
            secondLine={cleanStringWithURL(profileSecondRow)}
            thirdLine={cleanStringWithURL(profileThirdRow)}
            onSubmit={this.uploadBio}
            onHide={() =>
              this.setState({
                bioEditModalShown: false
              })
            }
          />
        }
        {imageEditModalShown &&
          <ImageEditModal
            imageUri={imageUri}
            onHide={() =>
              this.setState({
                imageUri: null,
                imageEditModalShown: false,
                processing: false
              })
            }
            processing={processing}
            onConfirm={this.uploadImage}
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

  uploadBio(params) {
    const {uploadBio} = this.props;
    uploadBio(params, () => {
      this.setState({
        bioEditModalShown: false
      })
    })
  }

  uploadImage(image) {
    const {uploadProfilePic} = this.props;

    this.setState({
      processing: true
    });

    uploadProfilePic(image, () => {
      this.setState({
        imageUri: null,
        processing: false,
        imageEditModalShown: false
      });
    })
  }
}
