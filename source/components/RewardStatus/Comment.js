import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ProfilePic from 'components/ProfilePic'
import UsernameText from 'components/Texts/UsernameText'
import { css } from 'emotion'
import { Color } from 'constants/css'
import LongText from 'components/Texts/LongText'
import EditTextArea from 'components/Texts/EditTextArea'
import DropdownButton from 'components/Buttons/DropdownButton'
import ErrorBoundary from 'components/Wrappers/ErrorBoundary'
import request from 'axios'
import { auth } from 'redux/constants'
import { URL } from 'constants/URL'
import { connect } from 'react-redux'

const API_URL = `${URL}/user`

class Comment extends Component {
  static propTypes = {
    authLevel: PropTypes.number,
    canEdit: PropTypes.bool,
    myId: PropTypes.number,
    onEditDone: PropTypes.func,
    star: PropTypes.object.isRequired
  }

  state = {
    onEdit: false
  }

  render() {
    const { authLevel, canEdit, myId, star } = this.props
    const { onEdit } = this.state
    const userIsUploader = star.rewarderId === myId
    const userCanEditThis = canEdit && authLevel > star.rewarderAuthLevel
    const editButtonShown = userIsUploader || userCanEditThis
    const editMenuItems = []
    if (userIsUploader || canEdit) {
      editMenuItems.push({
        label: 'Edit',
        onClick: () => this.setState({ onEdit: true })
      })
    }
    return (
      <ErrorBoundary>
        <div
          className={css`
            padding: 1rem;
            display: flex;
            align-items: space-between;
          `}
        >
          <div
            className={css`
              width: 6rem;
            `}
          >
            <ProfilePic
              userId={star.rewarderId}
              profilePicId={star.rewarderProfilePicId}
              style={{ width: '5rem', height: '5rem' }}
            />
          </div>
          <div
            className={css`
              width: 100%;
              margin-left: 0.5rem;
              font-size: 1.4rem;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            `}
          >
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ width: '100%' }}>
                <UsernameText
                  user={{
                    id: star.rewarderId,
                    name: star.rewarderUsername
                  }}
                  userId={myId}
                />{' '}
                <span
                  style={{
                    fontWeight: 'bold',
                    color:
                      star.rewardAmount === 2 ? Color.gold() : Color.orange()
                  }}
                >
                  rewarded {star.rewardAmount === 1 ? 'a' : star.rewardAmount}{' '}
                  Star{star.rewardAmount > 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ width: '100%' }}>
                {!onEdit && <LongText>{star.rewardComment}</LongText>}
                {onEdit && (
                  <EditTextArea
                    autoFocus
                    rows={3}
                    text={star.rewardComment}
                    onCancel={() => this.setState({ onEdit: false })}
                    onEditDone={this.onEditDone}
                  />
                )}
              </div>
            </div>
            {editButtonShown &&
              !onEdit && (
                <DropdownButton
                  snow
                  direction="left"
                  menuProps={editMenuItems}
                />
              )}
          </div>
        </div>
      </ErrorBoundary>
    )
  }

  onEditDone = async editedComment => {
    const { onEditDone = () => {}, star } = this.props
    try {
      const {
        data: { success }
      } = await request.put(
        `${API_URL}/reward`,
        { editedComment, contentId: star.id },
        auth()
      )
      if (success) {
        onEditDone({ id: star.id, text: editedComment })
      }
      this.setState({ onEdit: false })
    } catch (error) {
      console.error(error.response || error)
    }
  }
}

export default connect(state => ({
  canEdit: state.UserReducer.canEdit,
  authLevel: state.UserReducer.authLevel
}))(Comment)
