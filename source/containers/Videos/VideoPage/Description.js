import PropTypes from 'prop-types'
import React, {Component} from 'react'
import SmallDropdownButton from 'components/SmallDropdownButton'
import UsernameText from 'components/Texts/UsernameText'
import Textarea from 'react-textarea-autosize'
import Button from 'components/Button'
import LongText from 'components/Texts/LongText'
import {timeSince} from 'helpers/timeStampHelpers'
import UserListModal from 'components/Modals/UserListModal'
import VideoLikeInterface from './VideoLikeInterface'
import {
  cleanString,
  cleanStringWithURL,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji
} from 'helpers/stringHelpers'

export default class Description extends Component {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    likes: PropTypes.array,
    likeVideo: PropTypes.func,
    onDelete: PropTypes.func,
    uploaderId: PropTypes.number,
    userId: PropTypes.number,
    uploaderName: PropTypes.string,
    timeStamp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    videoId: PropTypes.number,
    videoViews: PropTypes.string,
    onEditFinish: PropTypes.func
  }

  constructor(props) {
    super()
    this.state = {
      onEdit: false,
      editedTitle: cleanString(props.title),
      editedDescription: cleanStringWithURL(props.description),
      editDoneButtonDisabled: true,
      userListModalShown: false
    }
    this.onEditFinish = this.onEditFinish.bind(this)
    this.onEditCancel = this.onEditCancel.bind(this)
    this.onVideoLikeClick = this.onVideoLikeClick.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.title !== this.props.title) {
      this.setState({
        editedTitle: cleanString(nextProps.title)
      })
    }
    if (nextProps.description !== this.props.description) {
      this.setState({
        editedDescription: cleanStringWithURL(nextProps.description)
      })
    }
  }

  render() {
    const menuProps = [
      {
        label: 'Edit',
        onClick: () => this.setState({onEdit: true})
      },
      {
        label: 'Delete',
        onClick: () => this.props.onDelete()
      }
    ]

    const {uploaderId, userId, uploaderName, title, description, likes, timeStamp, videoViews} = this.props
    let {onEdit, editedTitle, editedDescription, editDoneButtonDisabled, userListModalShown} = this.state
    editedDescription = editedDescription === 'No description' ? '' : this.state.editedDescription
    return (
      <div>
        <div
          className="row page-header"
          style={{marginTop: '1.4em', minHeight: '7em'}}
        >
          <div>
            <div className="container">
              <div className="col-xs-9">
                <div className="col-xs-12" style={{paddingLeft: '0px'}}>
                  {onEdit ?
                    <form
                      style={{paddingLeft: '0px', paddingBottom: '0.5em'}}
                      className="col-xs-6"
                      onSubmit={event => event.preventDefault()}
                    >
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Title..."
                        value={editedTitle}
                        onChange={event => {
                          this.setState({editedTitle: event.target.value}, () => {
                            this.determineEditButtonDoneStatus()
                          })
                        }}
                        onKeyUp={event => {
                          if (event.key === ' ') {
                            this.setState({editedTitle: addEmoji(event.target.value)})
                          }
                        }}
                      />
                    </form> :
                    <div
                      className="col-xs-9"
                      style={{paddingLeft: '0px'}}
                    >
                      <h3 style={{
                        marginTop: '0px',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        lineHeight: 'normal'
                      }}>
                        <span style={{wordWrap: 'break-word'}}>{cleanString(title)}</span>
                      </h3>
                    </div>
                  }
                </div>
                <div
                  className="col-xs-12"
                  style={{paddingLeft: '0px'}}>
                    <div>Added by <UsernameText user={{name: uploaderName, id: uploaderId}} /> {`${timeStamp ? '(' + timeSince(timeStamp) + ')' : ''}`}</div>
                    {uploaderId === userId && !onEdit &&
                      <SmallDropdownButton
                        style={{marginTop: '0.5em'}}
                        shape="button"
                        icon="pencil"
                        align="left"
                        text="Edit or Delete This Video"
                        menuProps={menuProps}
                      />
                    }
                </div>
              </div>
              <VideoLikeInterface
                userId={userId}
                likes={likes}
                onLikeClick={this.onVideoLikeClick}
                showLikerList={() => this.setState({userListModalShown: true})}
              />
            </div>
          </div>
        </div>
        <div className="container">
          {onEdit ?
            <div>
              <form className="col-xs-9" style={{paddingLeft: '0px'}}>
                <Textarea
                  minRows={4}
                  className="form-control"
                  placeholder="Enter Description"
                  value={editedDescription}
                  onChange={event => {
                    this.determineEditButtonDoneStatus()
                    this.setState({editedDescription: event.target.value}, () => {
                      this.determineEditButtonDoneStatus()
                    })
                  }}
                  onKeyUp={event => {
                    if (event.key === ' ') {
                      this.setState({editedDescription: addEmoji(event.target.value)})
                    }
                  }}
                 />
              </form>
              <div
                className="col-xs-9"
                style={{marginTop: '1em', paddingLeft: '0px', textAlign: 'left'}}
              >
                <Button
                  className="btn btn-default btn-sm"
                  disabled={editDoneButtonDisabled}
                  onClick={this.onEditFinish}
                >Done</Button>
                <Button
                  className="btn btn-default btn-sm"
                  style={{marginLeft: '5px'}}
                  onClick={this.onEditCancel}
                >Cancel</Button>
              </div>
            </div> :
            <div>
              {videoViews > 10 &&
                <p
                  style={{
                    fontSize: '1.6em',
                    fontWeight: 'bold'
                  }}
                >{videoViews} view{`${videoViews > 1 ? 's' : ''}`}
                </p>
              }
              <LongText style={{wordWrap: 'break-word', paddingLeft: '0px'}} className="col-xs-9">
                {stringIsEmpty(description) ? 'No Description' : description}
              </LongText>
            </div>
          }
        </div>
        {userListModalShown &&
          <UserListModal
            onHide={() => this.setState({userListModalShown: false})}
            title="People who liked this video"
            users={likes.map(like => {
              return {
                username: like.username,
                userId: like.userId
              }
            })}
            description="(You)"
          />
        }
      </div>
    )
  }

  determineEditButtonDoneStatus() {
    const titleIsEmpty = stringIsEmpty(this.state.editedTitle)
    const titleChanged = this.state.editedTitle !== this.props.title
    const descriptionChanged = this.state.editedDescription !== cleanStringWithURL(this.props.description)
    const editDoneButtonDisabled = titleIsEmpty || (!titleChanged && !descriptionChanged)
    this.setState({editDoneButtonDisabled})
  }

  onEditCancel() {
    const {description} = this.props
    const editedDescription = description === 'No description' ? '' : cleanStringWithURL(description)
    this.setState({
      editedTitle: cleanString(this.props.title),
      editedDescription,
      onEdit: false,
      editDoneButtonDisabled: true
    })
  }

  onEditFinish() {
    const params = {
      videoId: this.props.videoId,
      title: finalizeEmoji(this.state.editedTitle),
      description: finalizeEmoji(this.state.editedDescription)
    }
    this.props.onEditFinish(params, this)
  }

  onVideoLikeClick() {
    const {videoId} = this.props
    this.props.likeVideo(videoId)
  }
}
