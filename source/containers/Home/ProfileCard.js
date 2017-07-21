/* global FileReader */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ProfilePic from 'components/ProfilePic'
import Button from 'components/Button'
import ImageEditModal from './Modals/ImageEditModal'
import BioEditModal from './Modals/BioEditModal'
import {uploadProfilePic, uploadBio} from 'redux/actions/UserActions'
import {openDirectMessageChannel} from 'redux/actions/ChatActions'
import AlertModal from 'components/Modals/AlertModal'
import {connect} from 'react-redux'
import {cleanStringWithURL} from 'helpers/stringHelpers'
import {withRouter} from 'react-router'
import {Color} from 'constants/css'

class ProfileCard extends Component {
  static propTypes = {
    expandable: PropTypes.bool,
    history: PropTypes.object,
    openDirectMessageChannel: PropTypes.func,
    profile: PropTypes.object,
    userId: PropTypes.number,
    uploadBio: PropTypes.func,
    uploadProfilePic: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      imageUri: null,
      processing: false,
      imageEditModalShown: false,
      bioEditModalShown: false,
      alertModalShown: false
    }
    this.onChangeProfilePictureClick = this.onChangeProfilePictureClick.bind(this)
    this.handlePicture = this.handlePicture.bind(this)
    this.uploadBio = this.uploadBio.bind(this)
    this.uploadImage = this.uploadImage.bind(this)
  }

  render() {
    const {imageUri, imageEditModalShown, bioEditModalShown, alertModalShown, processing} = this.state
    const {profile, userId, expandable, history, openDirectMessageChannel} = this.props
    const {profileFirstRow, profileSecondRow, profileThirdRow} = profile
    return (
      <div
        className="panel panel-default"
        style={{borderTop: '#e7e7e7 1px solid'}}
      >
        <div className="panel-body">
          <div
            className="media"
            style={{height: 'auto'}}
          >
            <ProfilePic
              userId={profile.id}
              profilePicId={profile.profilePicId}
              size='13'
            />
            <div className="media-body" style={{paddingLeft: '1em', paddingRight: '5em'}}>
              <h2 className="media-heading">
                {profile.username} <small>{`(${profile.realName})`}</small>
              </h2>
              {userId !== profile.id && !!profile.online &&
                <p style={{color: Color.green, fontWeight: 'bold'}}>(online)</p>
              }
              {(!!profileFirstRow || !!profileSecondRow || !!profileThirdRow) &&
                <ul
                  className="col-md-8"
                  style={{
                    paddingLeft: '1em',
                    wordWrap: 'break-word',
                    minWidth: '30vw'
                  }}>
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
              <div>
                {!profileFirstRow && !profileSecondRow && !profileThirdRow && userId === profile.id &&
                  <p>**Add your bio so that your Twinkle friends can know you better</p>
                }
                {userId === profile.id &&
                  <div className="col-xs-12">
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
                {expandable && userId !== profile.id &&
                  <div className="col-xs-12" style={{paddingLeft: '0px'}}>
                    <Button
                      className="btn btn-lg btn-info" style={{marginTop: '0.5em'}}
                      onClick={() => history.push(`/users/${profile.username}`)}
                    >
                      View Profile
                    </Button>
                    <Button
                      className="btn btn-lg btn-success" style={{marginTop: '0.5em', marginLeft: '0.5em'}}
                      onClick={
                        () => openDirectMessageChannel({userId}, {userId: profile.id, username: profile.username}, false)
                      }
                    >
                      Message
                    </Button>
                  </div>
                }
              </div>
            </div>
            <input
              ref={ref => { this.fileInput = ref }}
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
        {alertModalShown &&
          <AlertModal
            title="Image is too large (limit: 5mb)"
            content="Please select a smaller image"
            onHide={() => this.setState({alertModalShown: false})}
          />
        }
      </div>
    )
  }

  onChangeProfilePictureClick() {
    this.fileInput.click()
  }

  handlePicture(event) {
    const reader = new FileReader()
    const maxSize = 5000
    const file = event.target.files[0]
    if (file.size/1000 > maxSize) return this.setState({alertModalShown: true})
    reader.onload = (upload) => {
      this.setState({
        imageEditModalShown: true,
        imageUri: upload.target.result
      })
    }

    reader.readAsDataURL(file)
    event.target.value = null
  }

  uploadBio(params) {
    const {uploadBio} = this.props
    uploadBio(params, () => {
      this.setState({
        bioEditModalShown: false
      })
    })
  }

  uploadImage(image) {
    const {uploadProfilePic} = this.props

    this.setState({
      processing: true
    })

    uploadProfilePic(image, () => {
      this.setState({
        imageUri: null,
        processing: false,
        imageEditModalShown: false
      })
    })
  }
}

export default connect(
  null,
  {
    uploadProfilePic,
    uploadBio,
    openDirectMessageChannel
  }
)(withRouter(ProfileCard))
