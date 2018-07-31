/* global FileReader */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ProfilePic from 'components/ProfilePic'
import Button from 'components/Button'
import ImageEditModal from 'components/Modals/ImageEditModal'
import BioEditModal from '../Modals/BioEditModal'
import ConfirmModal from 'components/Modals/ConfirmModal'
import {
  removeStatusMsg,
  updateStatusMsg,
  uploadProfilePic,
  uploadBio
} from 'redux/actions/UserActions'
import { openDirectMessageChannel } from 'redux/actions/ChatActions'
import AlertModal from 'components/Modals/AlertModal'
import { connect } from 'react-redux'
import {
  addEmoji,
  processedStringWithURL,
  renderText,
  finalizeEmoji
} from 'helpers/stringHelpers'
import { withRouter } from 'react-router'
import { borderRadius, Color, mobileMaxWidth } from 'constants/css'
import { css } from 'emotion'
import request from 'axios'
import { URL } from 'constants/URL'
import { auth } from 'helpers/requestHelpers'
import { timeSince } from 'helpers/timeStampHelpers'
import StatusInput from './StatusInput'
import RankBar from './RankBar'
import Icon from 'components/Icon'

class ProfilePanel extends Component {
  static propTypes = {
    expandable: PropTypes.bool,
    history: PropTypes.object,
    isCreator: PropTypes.bool,
    updateStatusMsg: PropTypes.func,
    openDirectMessageChannel: PropTypes.func,
    profile: PropTypes.object,
    removeStatusMsg: PropTypes.func,
    userId: PropTypes.number,
    uploadBio: PropTypes.func,
    uploadProfilePic: PropTypes.func
  }

  state = {
    confirmModalShown: false,
    editedStatusMsg: '',
    editedStatusColor: '',
    imageUri: null,
    processing: false,
    imageEditModalShown: false,
    bioEditModalShown: false,
    alertModalShown: false
  }

  render() {
    const {
      confirmModalShown,
      imageUri,
      imageEditModalShown,
      bioEditModalShown,
      alertModalShown,
      editedStatusMsg,
      editedStatusColor,
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
    const statusColor = editedStatusColor || profile.statusColor || 'logoBlue'
    return (
      <div
        className={css`
          display: flex;
          flex-direction: column;
          width: 100%;
          margin-bottom: 1rem;
          line-height: 2.3rem;
          font-size: 1.5rem;
          position: relative;
        `}
      >
        <div
          className={css`
            border: #e7e7e7 1px solid;
            background: #fff;
            padding: 2rem;
            border-top-left-radius: ${borderRadius};
            border-top-right-radius: ${borderRadius};
            display: flex;
            ${profile.twinkleXP ? 'border-bottom: none;' : ''}
            ${
              !profile.twinkleXP
                ? `border-bottom-left-radius: ${borderRadius};`
                : ''
            }
            ${
              !profile.twinkleXP
                ? `border-bottom-right-radius: ${borderRadius};`
                : ''
            }
            @media (max-width: ${mobileMaxWidth}) {
              border-radius: 0;
              border-left: none;
              border-right: none;
            }
          `}
        >
          <div style={{ width: '20rem' }}>
            <ProfilePic
              style={{ width: '18rem', height: '18rem' }}
              userId={profile.id}
              profilePicId={profile.profilePicId}
              online={userId === profile.id || !!profile.online}
              large
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
            <p style={{ fontSize: '1.5rem', color: Color.gray() }}>{`(${
              profile.realName
            })`}</p>
            {userId === profile.id && (
              <StatusInput
                innerRef={ref => {
                  this.StatusInput = ref
                }}
                profile={profile}
                statusColor={statusColor}
                editedStatusMsg={editedStatusMsg}
                setColor={color => this.setState({ editedStatusColor: color })}
                onTextChange={event => {
                  this.setState({
                    editedStatusMsg: addEmoji(renderText(event.target.value)),
                    ...(!event.target.value ? { editedStatusColor: '' } : {})
                  })
                }}
                onCancel={() =>
                  this.setState({
                    editedStatusMsg: '',
                    editedStatusColor: ''
                  })
                }
                onStatusSubmit={this.onStatusMsgSubmit}
              />
            )}
            {(profile.statusMsg || editedStatusMsg) && (
              <div
                className={css`
                  background: ${Color[statusColor]()};
                  color: ${statusColor === 'ivory' ? Color.black() : '#fff'};
                  font-size: 1.7rem;
                  padding: 1rem;
                  margin-top: 1rem;
                  box-shadow: 0 5px 5px ${Color.lightGray()};
                  overflow-wrap: break-word;
                  word-break: break-word;
                  > a {
                    color: ${statusColor === 'ivory'
                      ? Color.blue()
                      : statusColor === 'logoGreen'
                        ? Color.ivory()
                        : Color.gold()};
                  }
                `}
                dangerouslySetInnerHTML={{
                  __html: processedStringWithURL(
                    editedStatusMsg || profile.statusMsg
                  )
                }}
              />
            )}
            {profile.statusMsg &&
              !editedStatusMsg &&
              userId === profile.id && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '0.5rem'
                  }}
                >
                  <Button
                    transparent
                    onClick={() => {
                      this.setState({ editedStatusMsg: profile.statusMsg })
                      this.StatusInput.focus()
                    }}
                  >
                    <Icon icon="pencil-alt" />
                    <span style={{ marginLeft: '0.7rem' }}>Change</span>
                  </Button>
                  <Button
                    transparent
                    style={{ marginLeft: '1rem' }}
                    onClick={() => this.setState({ confirmModalShown: true })}
                  >
                    <Icon icon="trash-alt" />
                    <span style={{ marginLeft: '0.7rem' }}>Remove</span>
                  </Button>
                </div>
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
                  <a
                    style={{
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '2rem'
                    }}
                    onClick={() => this.setState({ bioEditModalShown: true })}
                  >
                    Introduce yourself!
                  </a>
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
              <div style={{ marginTop: '1.5rem', zIndex: 1, display: 'flex' }}>
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
                    marginTop: noProfile ? '2rem' : '1rem',
                    display: 'flex'
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
                    <Icon icon="comments" />
                    <span style={{ marginLeft: '0.7rem' }}>Message</span>
                  </Button>
                </div>
              )}
            {profile.lastActive &&
              !profile.online &&
              profile.id !== userId && (
                <div
                  style={{
                    marginTop: '1rem',
                    height: '1rem',
                    fontSize: '1.5rem',
                    color: Color.gray()
                  }}
                >
                  <p>last online {timeSince(profile.lastActive)}</p>
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
          {confirmModalShown && (
            <ConfirmModal
              onConfirm={this.onRemoveStatus}
              onHide={() => this.setState({ confirmModalShown: false })}
              title={`Remove Status Message`}
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
        {!!profile.twinkleXP && <RankBar profile={profile} />}
      </div>
    )
  }

  onChangeProfilePictureClick = () => {
    this.fileInput.click()
  }

  onRemoveStatus = async() => {
    const { removeStatusMsg, userId } = this.props
    await request.delete(`${URL}/user/statusMsg`, auth())
    removeStatusMsg(userId)
    this.setState({ confirmModalShown: false })
  }

  onStatusMsgSubmit = async() => {
    const { updateStatusMsg, profile } = this.props
    const { editedStatusMsg, editedStatusColor } = this.state
    const statusMsg = finalizeEmoji(editedStatusMsg)
    const statusColor = editedStatusColor || profile.statusColor
    const { data } = await request.post(
      `${URL}/user/statusMsg`,
      {
        statusMsg,
        statusColor
      },
      auth()
    )
    this.setState({ editedStatusColor: '', editedStatusMsg: '' })
    updateStatusMsg(data)
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
    removeStatusMsg,
    updateStatusMsg,
    uploadProfilePic,
    uploadBio,
    openDirectMessageChannel
  }
)(withRouter(ProfilePanel))
