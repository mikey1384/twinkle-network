import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import moment from 'moment'
import ProfilePic from 'components/ProfilePic'
import UsernameText from 'components/Texts/UsernameText'
import { connect } from 'react-redux'
import DropdownButton from 'components/DropdownButton'
import { processedStringWithURL } from 'helpers/stringHelpers'
import EditTextArea from 'components/Texts/EditTextArea'
import { editMessage, saveMessage } from 'redux/actions/ChatActions'
import Button from 'components/Button'
import { MessageStyle } from '../Styles'

class Message extends Component {
  static propTypes = {
    message: PropTypes.object,
    style: PropTypes.object,
    myId: PropTypes.number,
    onDelete: PropTypes.func,
    onEditDone: PropTypes.func,
    saveMessage: PropTypes.func,
    showSubjectMsgsModal: PropTypes.func,
    isCreator: PropTypes.bool,
    index: PropTypes.number
  }

  state = {
    onEdit: false,
    subjectMsgsModalShown: false,
    confirmModalShown: false
  }

  componentWillMount() {
    const { message, myId, saveMessage, index } = this.props
    if (!message.id && message.userId === myId && !message.isSubject) {
      saveMessage({ ...message, content: message.content }, index)
    }
  }

  render() {
    const {
      message: {
        id: messageId,
        userId,
        profilePicId,
        username,
        timeStamp,
        content,
        subjectId,
        isReloadedSubject,
        numMsgs
      },
      isCreator,
      onDelete,
      style,
      showSubjectMsgsModal,
      myId
    } = this.props
    const canEdit = myId === userId || isCreator
    const { onEdit } = this.state
    return (
      <Fragment>
        <div className={MessageStyle.container}>
          <ProfilePic
            style={MessageStyle.profilePic}
            userId={userId}
            profilePicId={profilePicId}
          />
          <div className={MessageStyle.contentWrapper}>
            {!!messageId &&
              !isReloadedSubject &&
              canEdit &&
              !onEdit && (
                <DropdownButton
                  snow
                  style={{ position: 'absolute', right: 0, zIndex: 1 }}
                  direction="left"
                  icon="pencil"
                  opacity={0.8}
                  menuProps={[
                    {
                      label: 'Edit',
                      onClick: () => this.setState({ onEdit: true })
                    },
                    {
                      label: 'Remove',
                      onClick: () => onDelete(messageId)
                    }
                  ]}
                />
              )}
            <div>
              <UsernameText
                style={MessageStyle.usernameText}
                user={{
                  id: userId,
                  name: username
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
                  onCancel={() => this.setState({ onEdit: false })}
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
            </div>
          </div>
        </div>
      </Fragment>
    )
  }

  onEditDone = editedMessage => {
    const { onEditDone, message } = this.props
    onEditDone({ editedMessage, messageId: message.id }).then(() =>
      this.setState({ onEdit: false })
    )
  }

  renderPrefix = () => {
    const { message: { isSubject, isReloadedSubject } } = this.props
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
    myId: state.UserReducer.userId,
    isCreator: state.UserReducer.isCreator
  }),
  {
    onEditDone: editMessage,
    saveMessage
  }
)(Message)
