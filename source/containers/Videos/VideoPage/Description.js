import PropTypes from 'prop-types'
import React, {Component} from 'react'
import DropdownButton from 'components/DropdownButton'
import UsernameText from 'components/Texts/UsernameText'
import Textarea from 'react-textarea-autosize'
import Button from 'components/Button'
import LongText from 'components/Texts/LongText'
import {timeSince} from 'helpers/timeStampHelpers'
import UserListModal from 'components/Modals/UserListModal'
import VideoLikeInterface from './VideoLikeInterface'
import FullTextReveal from 'components/FullTextReveal'
import {textIsOverflown} from 'helpers/domHelpers'
import Input from 'components/Texts/Input'
import {
  cleanString,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji,
  isValidYoutubeUrl
} from 'helpers/stringHelpers'
import {edit} from 'constants/placeholders'
import {connect} from 'react-redux'

class Description extends Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    isCreator: PropTypes.bool.isRequired,
    isStarred: PropTypes.bool,
    likes: PropTypes.array.isRequired,
    likeVideo: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEditCancel: PropTypes.func.isRequired,
    onEditFinish: PropTypes.func.isRequired,
    onEditStart: PropTypes.func.isRequired,
    timeStamp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    title: PropTypes.string.isRequired,
    uploaderId: PropTypes.number.isRequired,
    uploaderName: PropTypes.string.isRequired,
    userId: PropTypes.number,
    videoId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    videoViews: PropTypes.string.isRequired
  }

  constructor(props) {
    super()
    this.state = {
      onEdit: false,
      onTitleHover: false,
      editedTitle: cleanString(props.title),
      editedUrl: `https://www.youtube.com/watch?v=${props.content}`,
      editedDescription: props.description,
      editDoneButtonDisabled: true,
      userListModalShown: false
    }
    this.onEditStart = this.onEditStart.bind(this)
    this.onEditFinish = this.onEditFinish.bind(this)
    this.onEditCancel = this.onEditCancel.bind(this)
    this.onMouseOver = this.onMouseOver.bind(this)
    this.onVideoLikeClick = this.onVideoLikeClick.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.title !== this.props.title) {
      this.setState({
        editedTitle: cleanString(nextProps.title),
        onEdit: false
      })
    }
    if (nextProps.description !== this.props.description) {
      this.setState({
        editedDescription: nextProps.description,
        onEdit: false
      })
    }
    if (nextProps.content !== this.props.content) {
      this.setState({
        editedUrl: `https://www.youtube.com/watch?v=${nextProps.content}`,
        onEdit: false
      })
    }
  }

  render() {
    const menuProps = [
      {
        label: 'Edit',
        onClick: this.onEditStart
      },
      {
        label: 'Delete',
        onClick: () => this.props.onDelete()
      }
    ]

    const {
      isCreator, isStarred, uploaderId, userId, uploaderName, title,
      description, likes, timeStamp, videoId, videoViews
    } = this.props
    let {
      onEdit, editedTitle, editedUrl, editedDescription,
      editDoneButtonDisabled, userListModalShown, onTitleHover
    } = this.state
    editedDescription = editedDescription === 'No description' ? '' : this.state.editedDescription
    return (
      <div>
        <div
          className="page-header"
          style={{marginTop: '1.4em', minHeight: '7em'}}
        >
          <div>
            <div>
              <div className="pull-left col-xs-9" style={{paddingLeft: '0px'}}>
                <div>
                  {onEdit ?
                    <form
                      style={{paddingLeft: '0px', paddingBottom: '0.5em'}}
                      onSubmit={event => event.preventDefault()}
                    >
                      <Input
                        type="text"
                        className="form-control"
                        placeholder={edit.video}
                        style={{width: '30em'}}
                        value={editedUrl}
                        onChange={text => {
                          this.setState({editedUrl: text}, () => {
                            this.determineEditButtonDoneStatus()
                          })
                        }}
                      />
                      <Input
                        type="text"
                        className="form-control"
                        placeholder={edit.title}
                        style={{width: '30em', marginTop: '1em'}}
                        value={editedTitle}
                        onChange={text => {
                          this.setState({editedTitle: text}, () => {
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
                    <div style={{paddingLeft: '0px'}}>
                      <h3
                        ref={ref => { this.thumbLabel = ref }}
                        style={{
                          marginTop: '0px',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          lineHeight: 'normal'
                        }}
                      >
                        <span
                          style={{wordBreak: 'break-word'}}
                          onMouseOver={this.onMouseOver}
                          onMouseLeave={() => this.setState({onTitleHover: false})}
                        >
                          {cleanString(title)}
                        </span>
                      </h3>
                      <FullTextReveal width="100%" show={onTitleHover} text={cleanString(title)} />
                    </div>
                  }
                </div>
                <div style={{paddingLeft: '0px'}}>
                  <div>Added by <UsernameText user={{name: uploaderName, id: uploaderId}} /> {`${timeStamp ? '(' + timeSince(timeStamp) + ')' : ''}`}</div>
                  {(uploaderId === userId || isCreator) && !onEdit &&
                    <DropdownButton
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
                isStarred={isStarred}
                userId={userId}
                videoId={videoId}
                likes={likes}
                onLikeClick={this.onVideoLikeClick}
                showLikerList={() => this.setState({userListModalShown: true})}
              />
            </div>
          </div>
        </div>
        <div>
          {onEdit ?
            <div>
              <form style={{paddingLeft: '0px'}}>
                <Textarea
                  minRows={4}
                  className="form-control"
                  placeholder={edit.description}
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
              <div style={{marginTop: '1em', paddingLeft: '0px', textAlign: 'left'}}>
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
              <LongText style={{wordBreak: 'break-word', paddingLeft: '0px'}}>
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
    const urlIsInvalid = !isValidYoutubeUrl(this.state.editedUrl)
    const titleIsEmpty = stringIsEmpty(this.state.editedTitle)
    const titleChanged = this.state.editedTitle !== this.props.title
    const urlChanged = this.state.editedUrl !== `https://www.youtube.com/watch?v=${this.props.content}`
    const descriptionChanged = this.state.editedDescription !== this.props.description
    const editDoneButtonDisabled = urlIsInvalid || titleIsEmpty || (
      !titleChanged && !descriptionChanged && !urlChanged
    )
    this.setState({editDoneButtonDisabled})
  }

  onEditCancel() {
    const {description} = this.props
    const editedDescription = description === 'No description' ? '' : description
    this.props.onEditCancel()
    this.setState({
      editedUrl: `https://www.youtube.com/watch?v=${this.props.content}`,
      editedTitle: cleanString(this.props.title),
      editedDescription,
      onEdit: false,
      editDoneButtonDisabled: true
    })
  }

  onEditFinish() {
    const params = {
      url: this.state.editedUrl,
      videoId: this.props.videoId,
      title: finalizeEmoji(this.state.editedTitle),
      description: finalizeEmoji(this.state.editedDescription)
    }
    this.props.onEditFinish(params).then(
      () => this.setState({
        onEdit: false,
        editDoneButtonDisabled: true
      })
    )
  }

  onEditStart() {
    this.props.onEditStart()
    this.setState({onEdit: true})
  }

  onMouseOver() {
    if (textIsOverflown(this.thumbLabel)) {
      this.setState({onTitleHover: true})
    }
  }

  onVideoLikeClick() {
    const {videoId} = this.props
    this.props.likeVideo(videoId)
  }
}

export default connect(state => ({isCreator: state.UserReducer.isCreator}))(Description)
