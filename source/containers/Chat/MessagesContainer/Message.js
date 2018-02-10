import PropTypes from 'prop-types'
import React, { Component } from 'react'
import moment from 'moment'
import ProfilePic from 'components/ProfilePic'
import UsernameText from 'components/Texts/UsernameText'
import { connect } from 'react-redux'
import DropdownButton from 'components/DropdownButton'
import { processedStringWithURL } from 'helpers/stringHelpers'
import EditTextArea from 'components/Texts/EditTextArea'
import { editMessage, saveMessage } from 'redux/actions/ChatActions'
import Button from 'components/Button'
import { Style } from '../Style'
import SubjectMsgsModal from '../Modals/SubjectMsgsModal'

class Message extends Component {
  static propTypes = {
    message: PropTypes.object,
    style: PropTypes.object,
    myId: PropTypes.number,
    onDelete: PropTypes.func,
    onEditDone: PropTypes.func,
    saveMessage: PropTypes.func,
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
      myId
    } = this.props
    const canEdit = myId === userId || isCreator
    const { onEdit, subjectMsgsModalShown } = this.state
    return (
      <div style={Style.container}>
        <ProfilePic
          style={Style.profilePic}
          userId={userId}
          profilePicId={profilePicId}
        />
        <div style={Style.contentWrapper}>
          {!!messageId &&
            !isReloadedSubject &&
            canEdit &&
            !onEdit && (
              <DropdownButton
                shape="button"
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
              style={Style.usernameText}
              user={{
                id: userId,
                name: username
              }}
            />{' '}
            <span style={Style.timeStamp}>
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
                <div style={Style.messageWrapper}>
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
                    <div style={Style.relatedConversationsButton}>
                      <Button
                        className="btn btn-sm btn-success"
                        onClick={() =>
                          this.setState({ subjectMsgsModalShown: true })
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
        {subjectMsgsModalShown && (
          <SubjectMsgsModal
            subjectId={subjectId}
            subjectTitle={content}
            onHide={() => this.setState({ subjectMsgsModalShown: false })}
          />
        )}
      </div>
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
      prefix = <span style={Style.subjectPrefix}>Subject: </span>
    }
    if (isReloadedSubject) {
      prefix = <span style={Style.subjectPrefix}>{'Returning Subject: '}</span>
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
