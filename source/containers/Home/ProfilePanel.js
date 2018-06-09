/* global FileReader */

import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import ProfilePic from 'components/ProfilePic'
import Button from 'components/Button'
import ImageEditModal from 'components/Modals/ImageEditModal'
import BioEditModal from './Modals/BioEditModal'
import {
  updateStatusMsg,
  uploadProfilePic,
  uploadBio
} from 'redux/actions/UserActions'
import { openDirectMessageChannel } from 'redux/actions/ChatActions'
import AlertModal from 'components/Modals/AlertModal'
import { connect } from 'react-redux'
import {
  addCommasToNumber,
  processedStringWithURL,
  addEmoji,
  exceedsCharLimit,
  finalizeEmoji,
  renderCharLimit,
  renderText
} from 'helpers/stringHelpers'
import { withRouter } from 'react-router'
import { borderRadius, Color, mobileMaxWidth } from 'constants/css'
import { css } from 'emotion'
import Textarea from 'components/Texts/Textarea'
import request from 'axios'
import { URL } from 'constants/URL'
import { auth } from 'redux/constants'

class ProfilePanel extends Component {
  static propTypes = {
    expandable: PropTypes.bool,
    history: PropTypes.object,
    isCreator: PropTypes.bool,
    updateStatusMsg: PropTypes.func,
    openDirectMessageChannel: PropTypes.func,
    profile: PropTypes.object,
    userId: PropTypes.number,
    uploadBio: PropTypes.func,
    uploadProfilePic: PropTypes.func
  }

  state = {
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
    const rankColor =
      profile.rank === 1
        ? Color.gold()
        : profile.rank === 2
          ? Color.silver()
          : profile.rank === 3
            ? '#fff'
            : undefined
    const highlightEffects = {
      border: `5px solid #fff`,
      boxShadow: `0 0 5px #fff`
    }
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
            <span style={{ fontSize: '1.5rem', color: Color.gray() }}>{`(${
              profile.realName
            })`}</span>
            {userId === profile.id && (
              <Fragment>
                <Textarea
                  className={css`
                    margin-top: 1rem;
                  `}
                  minRows={1}
                  value={editedStatusMsg}
                  onChange={event => {
                    this.setState({
                      editedStatusMsg: addEmoji(renderText(event.target.value)),
                      ...(!event.target.value ? { editedStatusColor: '' } : {})
                    })
                  }}
                  placeholder={`Enter a ${
                    profile.statusMsg ? 'new' : ''
                  } status message`}
                  style={exceedsCharLimit({
                    contentType: 'statusMsg',
                    text: editedStatusMsg
                  })}
                />
                <p style={{ fontSize: '1.3rem' }}>
                  {renderCharLimit({
                    contentType: 'statusMsg',
                    text: editedStatusMsg
                  })}
                </p>
                {editedStatusMsg && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        width: '80%'
                      }}
                    >
                      <div
                        style={{
                          width: '3rem',
                          height: '3rem',
                          marginLeft: '1rem',
                          borderRadius: '50%',
                          background: Color.pink(),
                          cursor: 'pointer',
                          ...(statusColor !== 'pink' ? highlightEffects : {})
                        }}
                        onClick={() =>
                          this.setState({ editedStatusColor: 'pink' })
                        }
                      />
                      <div
                        style={{
                          width: '3rem',
                          height: '3rem',
                          marginLeft: '1rem',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          background: Color.ivory(),
                          ...(statusColor !== 'ivory' ? highlightEffects : {})
                        }}
                        onClick={() =>
                          this.setState({ editedStatusColor: 'ivory' })
                        }
                      />
                      <div
                        style={{
                          width: '3rem',
                          height: '3rem',
                          marginLeft: '1rem',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          background: Color.logoGreen(),
                          ...(statusColor !== 'logoGreen'
                            ? highlightEffects
                            : {})
                        }}
                        onClick={() =>
                          this.setState({ editedStatusColor: 'logoGreen' })
                        }
                      />
                      <div
                        style={{
                          width: '3rem',
                          height: '3rem',
                          marginLeft: '1rem',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          background: Color.logoBlue(),
                          ...(statusColor !== 'logoBlue'
                            ? highlightEffects
                            : {})
                        }}
                        onClick={() =>
                          this.setState({ editedStatusColor: 'logoBlue' })
                        }
                      />
                      <div
                        style={{
                          width: '3rem',
                          height: '3rem',
                          marginLeft: '1rem',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          background: Color.menuGray(),
                          ...(statusColor !== 'menuGray'
                            ? highlightEffects
                            : {})
                        }}
                        onClick={() =>
                          this.setState({ editedStatusColor: 'menuGray' })
                        }
                      />
                    </div>
                    <Button
                      primary
                      filled
                      style={{ marginLeft: '2rem' }}
                      onClick={this.onStatusMsgSubmit}
                    >
                      Submit
                    </Button>
                  </div>
                )}
              </Fragment>
            )}
            {(profile.statusMsg || editedStatusMsg) && (
              <div
                style={{
                  background: Color[statusColor](),
                  color: statusColor === 'ivory' ? Color.black() : '#fff',
                  fontSize: '1.7rem',
                  padding: '1rem',
                  marginTop: '1rem',
                  boxShadow: `0 5px 5px ${Color.lightGray()}`
                }}
                dangerouslySetInnerHTML={{
                  __html: processedStringWithURL(
                    editedStatusMsg || profile.statusMsg
                  )
                }}
              />
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
                  **Add your bio so that your Twinkle friends can know you
                  better
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
        {!!profile.twinkleXP && (
          <div
            className={css`
              padding: 1.5rem 0;
              font-size: 2rem;
              color: ${rankColor};
              font-weight: bold;
              text-align: center;
              border-bottom-left-radius: ${borderRadius};
              border-bottom-right-radius: ${borderRadius};
              ${profile.rank > 3 ? `border: 1px solid #e7e7e7;` : ''}
              background: ${
                profile.rank < 3
                  ? Color.black(1 - (profile.rank - 1) / 10)
                  : profile.rank === 3
                    ? Color.orange()
                    : Color.whiteGray()
              };
              @media (max-width: ${mobileMaxWidth}) {
                border-radius: 0;
                border-left: none;
                border-right: none;
              }
            `}
          >
            <span>
              <span
                style={{
                  color:
                    rankColor ||
                    (profile.rank <= 10 ? Color.logoBlue() : Color.buttonGray())
                }}
              >
                Rank
              </span>{' '}
              <span
                style={{
                  color:
                    rankColor ||
                    (profile.rank <= 10 ? Color.logoBlue() : Color.buttonGray())
                }}
              >
                #{profile.rank}
              </span>{' '}
              <span
                style={{
                  color:
                    rankColor ||
                    (profile.rank <= 10 ? Color.logoBlue() : Color.buttonGray())
                }}
              >
                with
              </span>
            </span>{' '}
            <span>
              <span
                style={{
                  color:
                    rankColor ||
                    (profile.rank <= 10
                      ? Color.logoGreen()
                      : Color.buttonGray())
                }}
              >
                {addCommasToNumber(profile.twinkleXP)}
              </span>{' '}
              <span
                style={{
                  color:
                    rankColor ||
                    (profile.rank <= 10 ? Color.gold() : Color.buttonGray())
                }}
              >
                XP
              </span>
            </span>
          </div>
        )}
      </div>
    )
  }

  onChangeProfilePictureClick = () => {
    this.fileInput.click()
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
    updateStatusMsg,
    uploadProfilePic,
    uploadBio,
    openDirectMessageChannel
  }
)(withRouter(ProfilePanel))
