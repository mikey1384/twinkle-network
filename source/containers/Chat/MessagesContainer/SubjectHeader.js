import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Color} from 'constants/css'
import Button from 'components/Button'
import {cleanString} from 'helpers/stringHelpers'
import Loading from 'components/Loading'
import {connect} from 'react-redux'
import {
  clearSubjectSearchResults,
  loadChatSubject,
  reloadChatSubject,
  uploadChatSubject,
  changeChatSubject,
  searchChatSubject
} from 'redux/actions/ChatActions'
import {textIsOverflown} from 'helpers/domHelpers'
import FullTextReveal from 'components/FullTextReveal'
import UsernameText from 'components/Texts/UsernameText'
import {timeSince} from 'helpers/timeStampHelpers'
import EditSubjectForm from './EditSubjectForm'
import {socket} from 'constants/io'
import {defaultChatSubject} from 'constants/defaultValues'

@connect(
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
)
export default class SubjectHeader extends Component {
  static propTypes = {
    clearSubjectSearchResults: PropTypes.func,
    userId: PropTypes.number,
    username: PropTypes.string,
    profilePicId: PropTypes.number,
    subject: PropTypes.string,
    changeChatSubject: PropTypes.func,
    loadChatSubject: PropTypes.func,
    reloadChatSubject: PropTypes.func,
    searchChatSubject: PropTypes.func,
    subjectSearchResults: PropTypes.array,
    uploadChatSubject: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      loaded: false,
      onHover: false,
      onEdit: false
    }
    this.onMouseOver = this.onMouseOver.bind(this)
    this.onReloadChatSubject = this.onReloadChatSubject.bind(this)
    this.onSubjectChange = this.onSubjectChange.bind(this)
    this.onSubjectSubmit = this.onSubjectSubmit.bind(this)
    this.renderDetails = this.renderDetails.bind(this)
  }

  componentDidMount() {
    const {loadChatSubject} = this.props
    socket.on('subject_change', this.onSubjectChange)

    return loadChatSubject().then(
      () => this.setState({loaded: true})
    )
  }

  componentWillUnmount() {
    socket.removeListener('subject_change', this.onSubjectChange)
  }

  render() {
    const {
      clearSubjectSearchResults, subject: {id: subjectId, content = defaultChatSubject},
      searchChatSubject, subjectSearchResults
    } = this.props
    const {loaded, onHover, onEdit} = this.state
    const subjectTitle = cleanString(content)
    return (
      <div style={{width: '100%', height: '4.5em', position: 'absolute', backgroundColor: '#fff'}}>
        {loaded ?
          <div>
            <div className="col-xs-10" style={{float: 'left', paddingLeft: '0px', paddingRight: '0px'}}>
              {!onEdit &&
                <div>
                  <h3
                    style={{
                      cursor: 'default',
                      marginTop: '0px',
                      marginBottom: '3px',
                      color: Color.green,
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      lineHeight: 'normal'
                    }}
                    onMouseOver={this.onMouseOver}
                    onMouseLeave={() => this.setState({onHover: false})}
                    ref={ref => { this.headerLabel = ref }}
                  >
                    Subject: {subjectTitle}
                  </h3>
                  <FullTextReveal
                    text={subjectTitle}
                    show={onHover}
                    width="1200px"
                  />
                </div>
              }
              {!onEdit && this.renderDetails()}
            </div>
            <div>
              {onEdit &&
                <EditSubjectForm
                  autoFocus
                  currentSubjectId={subjectId}
                  title={subjectTitle}
                  onEditSubmit={this.onSubjectSubmit}
                  onChange={text => searchChatSubject(text)}
                  onClickOutSide={() => {
                    this.setState({onEdit: false})
                    clearSubjectSearchResults()
                  }}
                  reloadChatSubject={this.onReloadChatSubject}
                  searchResults={subjectSearchResults}
                />
              }
            </div>
            <div className="col-xs-2 col-offset-xs-10" style={{float: 'right', paddingRight: '0px'}}>
              {!onEdit &&
                <Button
                  className="btn btn-info"
                  style={{float: 'right', marginRight: '1em'}}
                  onClick={() => this.setState({onEdit: true})}
                >
                  Change the Subject
                </Button>
              }
            </div>
          </div> :
          <Loading
            style = {{
              textAlign: 'center',
              fontSize: '2em',
              color: Color.green
            }}
            text="Loading Subject..."
          />
        }
      </div>
    )
  }

  onMouseOver() {
    if (textIsOverflown(this.headerLabel)) {
      this.setState({onHover: true})
    }
  }

  onSubjectChange({subject}) {
    const {changeChatSubject} = this.props
    changeChatSubject(subject)
  }

  onReloadChatSubject(subjectId) {
    const {reloadChatSubject, clearSubjectSearchResults} = this.props
    reloadChatSubject(subjectId).then(
      ({subjectId, message, subject}) => {
        socket.emit('new_subject', {subject, message})
        this.setState({onEdit: false})
        clearSubjectSearchResults()
      }
    )
  }

  onSubjectSubmit(text) {
    const {uploadChatSubject, username, userId, profilePicId} = this.props
    return uploadChatSubject(text).then(
      subjectId => {
        const timeStamp = Math.floor(Date.now()/1000)
        const subject = {
          id: subjectId,
          userId,
          username,
          reloadedBy: null,
          reloaderName: null,
          uploader: {id: userId, name: username},
          content: text,
          timeStamp
        }
        const message = {
          profilePicId,
          userId,
          username,
          content: text,
          isSubject: true,
          channelId: 2,
          timeStamp
        }
        socket.emit('new_subject', {subject, message})
        this.setState({onEdit: false})
      }
    )
  }

  renderDetails() {
    const {subject: {uploader = {}, reloader = {}, timeStamp, reloadTimeStamp}} = this.props
    const isReloaded = reloader && reloader.id
    let posterString = 'You can change this subject by clicking the blue "Change the subject" button'
    if (uploader.id) {
      posterString = <span>Started by <UsernameText user={uploader} /> {timeSince(timeStamp)}</span>
    }
    if (isReloaded) {
      posterString = <span>
        Brought back by <UsernameText user={reloader} /> {timeSince(reloadTimeStamp)} (started by {<UsernameText user={uploader} />})
      </span>
    }
    return (
      <div>
        {uploader ? <small>{posterString}</small> :
          <small>{'You can change the subject by clicking the "Change the Subject" button on the right'}</small>
        }
      </div>
    )
  }
}
