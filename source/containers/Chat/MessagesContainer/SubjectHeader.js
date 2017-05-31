import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Color} from 'constants/css'
import Button from 'components/Button'
import {cleanString} from 'helpers/stringHelpers'
import Loading from 'components/Loading'
import {connect} from 'react-redux'
import {loadChatSubject, uploadChatSubject, changeChatSubject} from 'redux/actions/ChatActions'
import {textIsOverflown} from 'helpers/domHelpers'
import FullTextReveal from 'components/FullTextReveal'
import UsernameText from 'components/Texts/UsernameText'
import {timeSince} from 'helpers/timeStampHelpers'
import EditTitleForm from 'components/Texts/EditTitleForm'
import {socket} from 'constants/io'

@connect(
  state => ({
    userId: state.UserReducer.userId,
    username: state.UserReducer.username,
    profilePicId: state.UserReducer.profilePicId,
    subject: state.ChatReducer.subject
  }),
  {
    changeChatSubject,
    loadChatSubject,
    uploadChatSubject
  }
)
export default class SubjectHeader extends Component {
  static propTypes = {
    userId: PropTypes.number,
    username: PropTypes.string,
    profilePicId: PropTypes.number,
    subject: PropTypes.string,
    changeChatSubject: PropTypes.func,
    loadChatSubject: PropTypes.func,
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
    this.onSubjectChange = this.onSubjectChange.bind(this)
    this.onSubjectSubmit = this.onSubjectSubmit.bind(this)
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
    const {subject: {content = 'Introduce yourself!', uploader, timeStamp}} = this.props
    const {loaded, onHover, onEdit} = this.state
    return (
      <div style={{width: '100%', height: '5em', position: 'absolute', backgroundColor: '#fff'}}>
        {loaded ?
          <div>
            <div className="col-xs-10" style={{float: 'left', paddingLeft: '0px'}}>
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
                    Subject: {cleanString(content)}
                  </h3>
                  <FullTextReveal
                    text={cleanString(content)}
                    show={onHover}
                    width="1200px"
                  />
                </div>
              }
              {onEdit &&
                <EditTitleForm
                  autoFocus
                  title={cleanString(content)}
                  onEditSubmit={this.onSubjectSubmit}
                  onClickOutSide={() => this.setState({onEdit: false})}
                />
              }
              <div>
                {uploader ?
                  <small>Posted by <UsernameText user={uploader} /> ({timeSince(timeStamp)})</small> :
                  <small>{'You can change the subject by clicking the "Change the Subject" button on the right'}</small>
                }
              </div>
            </div>
            <div className="col-xs-2 col-offset-xs-10" style={{float: 'right', paddingRight: '0px'}}>
              {!onEdit &&
                <Button
                  className="btn btn-info"
                  style={{float: 'right'}}
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

  onSubjectChange(subject) {
    const {changeChatSubject} = this.props
    changeChatSubject(subject)
  }

  onSubjectSubmit(text) {
    const {uploadChatSubject, username, userId, profilePicId} = this.props
    return uploadChatSubject(text).then(
      () => {
        socket.emit('new_subject', {
          uploader: {id: userId, name: username},
          profilePicId,
          content: text,
          timeStamp: Math.floor(Date.now()/1000)
        })
        this.setState({onEdit: false})
      }
    )
  }
}
