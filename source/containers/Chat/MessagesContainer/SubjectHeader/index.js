import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
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
import { Color, mobileMaxWidth } from 'constants/css'
import { css } from 'emotion'

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
        className={css`
          display: flex;
          position: relative;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 5rem;
          > section {
            width: 85%;
          }
          > aside {
            width: 14%;
          }
          @media (max-width: ${mobileMaxWidth}) {
            > section {
              width: 70%;
            }
            > aside {
              width: 30%;
            }
          }
        `}
      >
        {loaded ? (
          <Fragment>
            {!onEdit && (
              <Fragment>
                <section>
                  <span
                    style={{
                      cursor: 'default',
                      color: Color.green(),
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
                </section>
                <aside>
                  <Button
                    filled
                    info
                    style={{ fontSize: '1.3rem' }}
                    onClick={() => this.setState({ onEdit: true })}
                  >
                    Change Subject
                  </Button>
                </aside>
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
            absolute
            style={{
              color: Color.green()
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
