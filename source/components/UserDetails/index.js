import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'components/Link'
import StatusInput from './StatusInput'
import {
  addEmoji,
  finalizeEmoji,
  processedStringWithURL,
  renderText
} from 'helpers/stringHelpers'
import Button from 'components/Button'
import Icon from 'components/Icon'
import BioEditModal from 'components/Modals/BioEditModal'
import ConfirmModal from 'components/Modals/ConfirmModal'
import { css } from 'emotion'
import { Color } from 'constants/css'
import { URL } from 'constants/URL'
import request from 'axios'
import { auth } from 'helpers/requestHelpers'

export default class UserDetails extends Component {
  static propTypes = {
    isProfilePage: PropTypes.bool,
    profile: PropTypes.object.isRequired,
    style: PropTypes.object,
    unEditable: PropTypes.bool,
    updateStatusMsg: PropTypes.func.isRequired,
    uploadBio: PropTypes.func.isRequired,
    userId: PropTypes.number,
    small: PropTypes.bool
  }

  state = {
    bioEditModalShown: false,
    confirmModalShown: false,
    editedStatusMsg: '',
    editedStatusColor: ''
  }

  render() {
    const {
      isProfilePage,
      profile,
      small,
      style = {},
      unEditable,
      userId
    } = this.props
    const {
      bioEditModalShown,
      confirmModalShown,
      editedStatusColor,
      editedStatusMsg
    } = this.state
    const statusColor = editedStatusColor || profile.statusColor || 'logoBlue'
    const { profileFirstRow, profileSecondRow, profileThirdRow } = profile
    const noProfile = !profileFirstRow && !profileSecondRow && !profileThirdRow
    return (
      <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
        <Link
          to={isProfilePage ? null : `/users/${profile.username}`}
          style={{
            fontSize: small ? '2.5rem' : '3.5rem',
            fontWeight: 'bold',
            color: Color.darkGray(),
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 'normal',
            textDecoration: 'none'
          }}
          className={
            isProfilePage
              ? ''
              : css`
                  transition: color 0.2s;
                  &:hover {
                    color: ${Color.orange()}!important;
                  }
                `
          }
        >
          {profile.username}
        </Link>
        <p
          style={{ fontSize: small ? '1rem' : '1.5rem', color: Color.gray() }}
        >{`(${profile.realName})`}</p>
        {userId === profile.id &&
          !unEditable && (
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
          userId === profile.id &&
          !unEditable && (
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
          (userId === profile.id && !unEditable ? (
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
      </div>
    )
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

  uploadBio = async params => {
    const { profile, uploadBio } = this.props
    await uploadBio({ ...params, profileId: profile.id })
    this.setState({
      bioEditModalShown: false
    })
  }
}
