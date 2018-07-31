import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import moment from 'moment'
import ProfilePic from 'components/ProfilePic'
import UsernameText from 'components/Texts/UsernameText'
import { connect } from 'react-redux'
import DropdownButton from 'components/Buttons/DropdownButton'
import { processedStringWithURL } from 'helpers/stringHelpers'
import EditTextArea from 'components/Texts/EditTextArea'
import { editMessage, saveMessage } from 'redux/actions/ChatActions'
import Button from 'components/Button'
import { MessageStyle } from '../Styles'

class Message extends Component {
  static propTypes = {
    authLevel: PropTypes.number,
    canDelete: PropTypes.bool,
    canEdit: PropTypes.bool,
    message: PropTypes.object,
    style: PropTypes.object,
    myId: PropTypes.number,
    onDelete: PropTypes.func,
    onEditDone: PropTypes.func,
    saveMessage: PropTypes.func,
    showSubjectMsgsModal: PropTypes.func,
    index: PropTypes.number,
    isLastMsg: PropTypes.bool,
    setScrollToBottom: PropTypes.func
  }

  state = {
    onEdit: false,
    subjectMsgsModalShown: false,
    confirmModalShown: false
  }

  componentDidMount() {
    const { message, myId, saveMessage, index } = this.props
    if (!message.id && message.userId === myId && !message.isSubject) {
      saveMessage({ ...message, content: message.content }, index)
    }
  }

  render() {
    const {
      authLevel,
      canDelete,
      canEdit,
      message: {
        id: messageId,
        userId,
        profilePicId,
        username,
        timeStamp,
        content,
        subjectId,
        isReloadedSubject,
        numMsgs,
        uploaderAuthLevel
      },
      isLastMsg,
      onDelete,
      style,
      showSubjectMsgsModal,
      myId,
      setScrollToBottom
    } = this.props
    const { editPadding } = this.state
    const userIsUploader = myId === userId
    const userCanEditThis =
      (canEdit || canDelete) && authLevel > uploaderAuthLevel
    const editButtonShown = userIsUploader || userCanEditThis
    const editMenuItems = []
    if (userIsUploader || canEdit) {
      editMenuItems.push({
        label: 'Edit',
        onClick: () =>
          this.setState({ onEdit: true, editPadding: false }, () => {
            if (isLastMsg) {
              setTimeout(() => setScrollToBottom(), 0)
            }
          })
      })
    }
    if (userIsUploader || canDelete) {
      editMenuItems.push({
        label: 'Remove',
        onClick: () => onDelete(messageId)
      })
    }
    const { onEdit } = this.state
    return (
      <Fragment>
        <div className={MessageStyle.container}>
          <ProfilePic
            className={MessageStyle.profilePic}
            userId={userId}
            profilePicId={profilePicId}
          />
          <div className={MessageStyle.contentWrapper}>
            <div>
              <UsernameText
                style={MessageStyle.usernameText}
                user={{
                  id: userId,
                  username: username
                }}
              />{' '}
              <span className={MessageStyle.timeStamp}>
                {moment.unix(timeStamp).format('LLL')}
              </span>
            </div>
            <div>
              {onEdit ? (
                <EditTextArea
                  autoFocus
                  rows={2}
                  text={content}
                  onCancel={() =>
                    this.setState({ onEdit: false, editPadding: false })
                  }
                  onEditDone={this.onEditDone}
                />
              ) : (
                <div>
                  <div className={MessageStyle.messageWrapper}>
                    {this.renderPrefix()}
                    <span
                      style={style}
                      dangerouslySetInnerHTML={{
                        __html: processedStringWithURL(content)
                      }}
                    />
                  </div>
                  {!!messageId &&
                    !isReloadedSubject &&
                    editButtonShown &&
                    !onEdit && (
                      <DropdownButton
                        snow
                        style={{ position: 'absolute', top: 0, right: '5px' }}
                        direction="left"
                        opacity={0.8}
                        onButtonClick={menuDisplayed => {
                          this.setState(
                            {
                              editPadding: !menuDisplayed && isLastMsg
                            },
                            () => (isLastMsg ? setScrollToBottom() : null)
                          )
                        }}
                        onOutsideClick={() => {
                          this.setState({
                            editPadding: false
                          })
                        }}
                        menuProps={editMenuItems}
                      />
                    )}
                  {!!isReloadedSubject &&
                    !!numMsgs &&
                    numMsgs > 0 && (
                      <div className={MessageStyle.relatedConversationsButton}>
                        <Button
                          filled
                          success
                          onClick={() =>
                            showSubjectMsgsModal({ subjectId, content })
                          }
                        >
                          Show related conversations
                        </Button>
                      </div>
                    )}
                </div>
              )}
              {editPadding && <div style={{ height: '10rem' }} />}
            </div>
          </div>
        </div>
      </Fragment>
    )
  }

  onEditDone = editedMessage => {
    const { onEditDone, message } = this.props
    onEditDone({ editedMessage, messageId: message.id }).then(() =>
      this.setState({ onEdit: false, editPadding: false })
    )
  }

  renderPrefix = () => {
    const {
      message: { isSubject, isReloadedSubject }
    } = this.props
    let prefix = ''
    if (isSubject) {
      prefix = <span className={MessageStyle.subjectPrefix}>Subject: </span>
    }
    if (isReloadedSubject) {
      prefix = (
        <span className={MessageStyle.subjectPrefix}>
          {'Returning Subject: '}
        </span>
      )
    }
    return prefix
  }
}

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
    canDelete: state.UserReducer.canDelete,
    canEdit: state.UserReducer.canEdit,
    myId: state.UserReducer.userId
  }),
  {
    onEditDone: editMessage,
    saveMessage
  }
)(Message)
