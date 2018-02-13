import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Color } from 'constants/css'
import Button from 'components/Button'
import { cleanString } from 'helpers/stringHelpers'
import Loading from 'components/Loading'
import { connect } from 'react-redux'
import {
  clearSubjectSearchResults,
  loadChatSubject,
  reloadChatSubject,
  uploadChatSubject,
  changeChatSubject,
  searchChatSubject
} from 'redux/actions/ChatActions'
import { textIsOverflown } from 'helpers/domHelpers'
import FullTextReveal from 'components/FullTextReveal'
import UsernameText from 'components/Texts/UsernameText'
import { timeSince } from 'helpers/timeStampHelpers'
import EditSubjectForm from './EditSubjectForm'
import { socket } from 'constants/io'
import { defaultChatSubject } from 'constants/defaultValues'

class SubjectHeader extends Component {
  static propTypes = {
    clearSubjectSearchResults: PropTypes.func,
    userId: PropTypes.number,
    username: PropTypes.string,
    profilePicId: PropTypes.number,
    subject: PropTypes.object,
    changeChatSubject: PropTypes.func,
    loadChatSubject: PropTypes.func,
    reloadChatSubject: PropTypes.func,
    searchChatSubject: PropTypes.func,
    subjectSearchResults: PropTypes.array,
    uploadChatSubject: PropTypes.func
  }

  state = {
    loaded: false,
    onHover: false,
    onEdit: false
  }

  componentDidMount() {
    const { loadChatSubject } = this.props
    this.mounted = true
    socket.on('subject_change', this.onSubjectChange)
    return loadChatSubject().then(() => {
      if (this.mounted) this.setState({ loaded: true })
    })
  }

  componentWillUnmount() {
    this.mounted = false
    socket.removeListener('subject_change', this.onSubjectChange)
  }

  render() {
    const {
      clearSubjectSearchResults,
      subject: { id: subjectId, content = defaultChatSubject },
      searchChatSubject,
      subjectSearchResults
    } = this.props
    const { loaded, onHover, onEdit } = this.state
    const subjectTitle = cleanString(content)
    return (
      <div
        style={{
          right: 0,
          left: 0,
          padding: '1rem 0',
          position: 'absolute',
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {loaded ? (
          <Fragment>
            {!onEdit && (
              <Fragment>
                <div style={{ width: '85%' }}>
                  <span
                    style={{
                      cursor: 'default',
                      color: Color.green,
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      lineHeight: 'normal',
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      display: 'block'
                    }}
                    onMouseOver={this.onMouseOver}
                    onMouseLeave={() => this.setState({ onHover: false })}
                    ref={ref => {
                      this.headerLabel = ref
                    }}
                  >
                    Subject: {subjectTitle}
                  </span>
                  <FullTextReveal
                    text={subjectTitle}
                    show={onHover}
                    width="100%"
                  />
                  {this.renderDetails()}
                </div>
                <div style={{ width: '14%' }}>
                  <Button
                    style={{ width: '100%' }}
                    className="btn btn-info"
                    onClick={() => this.setState({ onEdit: true })}
                  >
                    Change the Subject
                  </Button>
                </div>
              </Fragment>
            )}
            {onEdit && (
              <EditSubjectForm
                autoFocus
                currentSubjectId={subjectId}
                title={subjectTitle}
                onEditSubmit={this.onSubjectSubmit}
                onChange={text => searchChatSubject(text)}
                onClickOutSide={() => {
                  this.setState({ onEdit: false })
                  clearSubjectSearchResults()
                }}
                reloadChatSubject={this.onReloadChatSubject}
                searchResults={subjectSearchResults}
              />
            )}
          </Fragment>
        ) : (
          <Loading
            style={{
              textAlign: 'center',
              fontSize: '2em',
              color: Color.green
            }}
            text="Loading Subject..."
          />
        )}
      </div>
    )
  }

  onMouseOver = () => {
    if (textIsOverflown(this.headerLabel)) {
      this.setState({ onHover: true })
    }
  }

  onSubjectChange = ({ subject }) => {
    const { changeChatSubject } = this.props
    changeChatSubject(subject)
  }

  onReloadChatSubject = subjectId => {
    const { reloadChatSubject, clearSubjectSearchResults } = this.props
    return reloadChatSubject(subjectId).then(
      ({ subjectId, message, subject }) => {
        socket.emit('new_subject', { subject, message })
        if (this.mounted) {
          this.setState({ onEdit: false })
        }
        clearSubjectSearchResults()
      }
    )
  }

  onSubjectSubmit = text => {
    const { uploadChatSubject, username, userId, profilePicId } = this.props
    const content = `${text[0].toUpperCase()}${text.slice(1)}`
    return uploadChatSubject(text).then(subjectId => {
      const timeStamp = Math.floor(Date.now() / 1000)
      const subject = {
        id: subjectId,
        userId,
        username,
        reloadedBy: null,
        reloaderName: null,
        uploader: { id: userId, name: username },
        content,
        timeStamp
      }
      const message = {
        profilePicId,
        userId,
        username,
        content,
        isSubject: true,
        channelId: 2,
        timeStamp
      }
      socket.emit('new_subject', { subject, message })
      if (this.mounted) this.setState({ onEdit: false })
    })
  }

  renderDetails = () => {
    const {
      subject: { uploader = {}, reloader = {}, timeStamp, reloadTimeStamp }
    } = this.props
    const isReloaded = reloader && reloader.id
    let posterString =
      'You can change this subject by clicking the blue "Change the subject" button'
    if (uploader.id) {
      posterString = (
        <span>
          Started by <UsernameText user={uploader} /> {timeSince(timeStamp)}
        </span>
      )
    }
    if (isReloaded) {
      posterString = (
        <span>
          Brought back by <UsernameText user={reloader} />{' '}
          {timeSince(reloadTimeStamp)} (started by{' '}
          {<UsernameText user={uploader} />})
        </span>
      )
    }
    return (
      <Fragment>
        {uploader ? (
          <small>{posterString}</small>
        ) : (
          <small>
            {
              'You can change the subject by clicking the "Change the Subject" button on the right'
            }
          </small>
        )}
      </Fragment>
    )
  }
}

export default connect(
  state => ({
    userId: state.UserReducer.userId,
    username: state.UserReducer.username,
    profilePicId: state.UserReducer.profilePicId,
    subject: state.ChatReducer.subject,
    subjectSearchResults: state.ChatReducer.subjectSearchResults
  }),
  {
    clearSubjectSearchResults,
    changeChatSubject,
    loadChatSubject,
    reloadChatSubject,
    uploadChatSubject,
    searchChatSubject
  }
)(SubjectHeader)
