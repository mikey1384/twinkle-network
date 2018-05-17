/* global FileReader */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ProfilePic from 'components/ProfilePic'
import Button from 'components/Button'
import ImageEditModal from 'components/Modals/ImageEditModal'
import BioEditModal from './Modals/BioEditModal'
import { uploadProfilePic, uploadBio } from 'redux/actions/UserActions'
import { openDirectMessageChannel } from 'redux/actions/ChatActions'
import AlertModal from 'components/Modals/AlertModal'
import { connect } from 'react-redux'
import { processedStringWithURL } from 'helpers/stringHelpers'
import { withRouter } from 'react-router'
import { Color } from 'constants/css'
import { profilePanel } from './Styles'

class ProfilePanel extends Component {
  static propTypes = {
    expandable: PropTypes.bool,
    history: PropTypes.object,
    isCreator: PropTypes.bool,
    openDirectMessageChannel: PropTypes.func,
    profile: PropTypes.object,
    userId: PropTypes.number,
    uploadBio: PropTypes.func,
    uploadProfilePic: PropTypes.func
  }

  state = {
    imageUri: null,
    processing: false,
    imageEditModalShown: false,
    bioEditModalShown: false,
    alertModalShown: false
  }

  render() {
    const {
      imageUri,
      imageEditModalShown,
      bioEditModalShown,
      alertModalShown,
      processing
    } = this.state
    const {
      profile,
      userId,
      expandable,
      history,
      isCreator,
      openDirectMessageChannel
    } = this.props
    const { profileFirstRow, profileSecondRow, profileThirdRow } = profile
    const canEdit = userId === profile.id || isCreator
    const noProfile = !profileFirstRow && !profileSecondRow && !profileThirdRow
    return (
      <div className={profilePanel}>
        <div style={{ width: '20rem' }}>
          <ProfilePic
            style={{ width: '18rem', height: '18rem' }}
            userId={profile.id}
            profilePicId={profile.profilePicId}
          />
        </div>
        <div
          style={{
            marginLeft: '2rem',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            width: 'CALC(100% - 18rem)'
          }}
        >
          <span
            style={{
              fontSize: '3.5rem',
              fontWeight: 'bold',
              color: Color.darkGray(),
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 'normal'
            }}
          >
            {profile.username}
          </span>
          <span style={{ fontSize: '1.5rem', color: Color.gray() }}>{`(${
            profile.realName
          })`}</span>
          {userId !== profile.id &&
            !!profile.online && (
              <p
                style={{
                  color: Color.green(),
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}
              >
                (online)
              </p>
            )}
          {!noProfile && (
            <ul
              style={{
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                paddingLeft: '2rem'
              }}
            >
              {profileFirstRow && (
                <li
                  dangerouslySetInnerHTML={{
                    __html: processedStringWithURL(profileFirstRow)
                  }}
                />
              )}
              {profileSecondRow && (
                <li
                  dangerouslySetInnerHTML={{
                    __html: processedStringWithURL(profileSecondRow)
                  }}
                />
              )}
              {profileThirdRow && (
                <li
                  dangerouslySetInnerHTML={{
                    __html: processedStringWithURL(profileThirdRow)
                  }}
                />
              )}
            </ul>
          )}
          {noProfile &&
            (userId === profile.id ? (
              <div style={{ padding: '4rem 1rem 3rem 1rem' }}>
                **Add your bio so that your Twinkle friends can know you better
              </div>
            ) : (
              <div
                style={{
                  height: '6rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start'
                }}
              >
                <span>
                  {profile.username} {`does not have a bio, yet`}
                </span>
              </div>
            ))}
          {canEdit && (
            <div style={{ marginTop: '1.5rem', zIndex: 1 }}>
              <Button
                transparent
                onClick={() => this.setState({ bioEditModalShown: true })}
              >
                Edit Bio
              </Button>
              <Button transparent onClick={this.onChangeProfilePictureClick}>
                Change Profile Picture
              </Button>
            </div>
          )}
          {expandable &&
            userId !== profile.id && (
              <div
                style={{
                  marginTop: noProfile ? '2rem' : '1rem'
                }}
              >
                <Button
                  primary
                  onClick={() => history.push(`/users/${profile.username}`)}
                >
                  View Profile
                </Button>
                <Button
                  style={{ marginLeft: '0.5rem' }}
                  success
                  onClick={() =>
                    openDirectMessageChannel(
                      { userId },
                      { userId: profile.id, username: profile.username },
                      false
                    )
                  }
                >
                  Message
                </Button>
              </div>
            )}
        </div>
        <input
          ref={ref => {
            this.fileInput = ref
          }}
          style={{ display: 'none' }}
          type="file"
          onChange={this.handlePicture}
          accept="image/*"
        />
        {bioEditModalShown && (
          <BioEditModal
            firstLine={profileFirstRow}
            secondLine={profileSecondRow}
            thirdLine={profileThirdRow}
            onSubmit={this.uploadBio}
            onHide={() =>
              this.setState({
                bioEditModalShown: false
              })
            }
          />
        )}
        {imageEditModalShown && (
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
        )}
        {alertModalShown && (
          <AlertModal
            title="Image is too large (limit: 5mb)"
            content="Please select a smaller image"
            onHide={() => this.setState({ alertModalShown: false })}
          />
        )}
      </div>
    )
  }

  onChangeProfilePictureClick = () => {
    this.fileInput.click()
  }

  handlePicture = event => {
    const reader = new FileReader()
    const maxSize = 5000
    const file = event.target.files[0]
    if (file.size / 1000 > maxSize) {
      return this.setState({ alertModalShown: true })
    }
    reader.onload = upload => {
      this.setState({
        imageEditModalShown: true,
        imageUri: upload.target.result
      })
    }

    reader.readAsDataURL(file)
    event.target.value = null
  }

  uploadBio = async params => {
    const { profile, uploadBio } = this.props
    await uploadBio({ ...params, profileId: profile.id })
    this.setState({
      bioEditModalShown: false
    })
  }

  uploadImage = async image => {
    const { uploadProfilePic } = this.props

    this.setState({
      processing: true
    })
    await uploadProfilePic(image)
    this.setState({
      imageUri: null,
      processing: false,
      imageEditModalShown: false
    })
  }
}

export default connect(
  state => ({
    isCreator: state.UserReducer.isCreator,
    userId: state.UserReducer.userId
  }),
  {
    uploadProfilePic,
    uploadBio,
    openDirectMessageChannel
  }
)(withRouter(ProfilePanel))
