import PropTypes from 'prop-types'
import React, { Component } from 'react'
import DropdownButton from 'components/DropdownButton'
import UsernameText from 'components/Texts/UsernameText'
import Textarea from 'components/Texts/Textarea'
import Button from 'components/Button'
import LongText from 'components/Texts/LongText'
import { timeSince } from 'helpers/timeStampHelpers'
import UserListModal from 'components/Modals/UserListModal'
import FullTextReveal from 'components/FullTextReveal'
import { textIsOverflown } from 'helpers/domHelpers'
import Input from 'components/Texts/Input'
import {
  cleanString,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji,
  isValidYoutubeUrl
} from 'helpers/stringHelpers'
import { edit } from 'constants/placeholders'
import Likers from 'components/Likers'
import LikeButton from 'components/LikeButton'
import StarButton from 'components/StarButton'
import { starVideo } from 'redux/actions/VideoActions'
import { connect } from 'react-redux'

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
    starVideo: PropTypes.func.isRequired,
    timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    title: PropTypes.string.isRequired,
    uploaderId: PropTypes.number.isRequired,
    uploaderName: PropTypes.string.isRequired,
    userId: PropTypes.number,
    videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
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
      isCreator,
      isStarred,
      uploaderId,
      userId,
      uploaderName,
      title,
      description,
      likes,
      starVideo,
      timeStamp,
      videoId,
      videoViews
    } = this.props
    let {
      onEdit,
      editedTitle,
      editedUrl,
      editedDescription,
      editDoneButtonDisabled,
      userListModalShown,
      onTitleHover
    } = this.state
    editedDescription =
      editedDescription === 'No description' ? '' : this.state.editedDescription
    const starButtonGrid = isCreator ? 'starButton' : 'likeButton'
    return (
      <div
        style={{
          display: 'grid',
          height: 'auto',
          marginTop: '1.5rem',
          alignItems: 'center',
          alignContent: 'space-around',
          gridTemplateColumns: '30% 1fr 1fr 2% 15%',
          gridTemplateRows: '20% 2% 60% auto',
          gridColumnGap: '1rem',
          gridRowGap: '1.2rem',
          gridTemplateAreas: `
            "title title title ${starButtonGrid} likeButton"
            "description description description likers likers"
            "description description description . ."
          `
        }}
      >
        <div style={{ gridArea: 'title', alignSelf: 'center' }}>
          {onEdit ? (
            <div>
              <Input
                type="text"
                className="form-control"
                placeholder={edit.video}
                value={editedUrl}
                onChange={text => {
                  this.setState({ editedUrl: text }, () => {
                    this.determineEditButtonDoneStatus()
                  })
                }}
              />
              <Input
                style={{ marginTop: '1rem' }}
                type="text"
                className="form-control"
                placeholder={edit.title}
                value={editedTitle}
                onChange={text => {
                  this.setState({ editedTitle: text }, () => {
                    this.determineEditButtonDoneStatus()
                  })
                }}
                onKeyUp={event => {
                  if (event.key === ' ') {
                    this.setState({
                      editedTitle: addEmoji(event.target.value)
                    })
                  }
                }}
              />
            </div>
          ) : (
            <div>
              <div
                ref={ref => {
                  this.thumbLabel = ref
                }}
                style={{
                  width: '100%',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  lineHeight: 'normal'
                }}
              >
                <span
                  style={{
                    wordBreak: 'break-word',
                    fontSize: '3rem',
                    fontWeight: 'bold'
                  }}
                  onMouseOver={this.onMouseOver}
                  onMouseLeave={() => this.setState({ onTitleHover: false })}
                >
                  {cleanString(title)}
                </span>
              </div>
              <FullTextReveal
                width="100%"
                show={onTitleHover}
                text={cleanString(title)}
              />
            </div>
          )}
          {!onEdit && (
            <div>
              Added by{' '}
              <UsernameText
                user={{ name: uploaderName, id: uploaderId }}
              />{' '}
              <span>{`${
                timeStamp ? timeSince(timeStamp) : ''
              }`}</span>
            </div>
          )}
          {!onEdit &&
            videoViews > 10 && (
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  marginTop: '0.5rem'
                }}
              >
                {videoViews} view{`${videoViews > 1 ? 's' : ''}`}
              </div>
            )}
        </div>
        <div
          style={{
            gridArea: 'description',
            alignSelf: 'start'
          }}
        >
          {onEdit ? (
            <div>
              <form>
                <Textarea
                  minRows={4}
                  className="form-control"
                  placeholder={edit.description}
                  value={editedDescription}
                  onChange={event => {
                    this.determineEditButtonDoneStatus()
                    this.setState(
                      { editedDescription: event.target.value },
                      () => {
                        this.determineEditButtonDoneStatus()
                      }
                    )
                  }}
                  onKeyUp={event => {
                    if (event.key === ' ') {
                      this.setState({
                        editedDescription: addEmoji(event.target.value)
                      })
                    }
                  }}
                />
              </form>
              <div style={{ marginTop: '1rem' }}>
                <Button
                  className="btn btn-default btn-sm"
                  disabled={editDoneButtonDisabled}
                  onClick={this.onEditFinish}
                >
                  Done
                </Button>
                <Button
                  className="btn btn-default btn-sm"
                  style={{ marginLeft: '0.5rem' }}
                  onClick={this.onEditCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <LongText style={{ wordBreak: 'break-word' }}>
                {stringIsEmpty(description) ? 'No Description' : description}
              </LongText>
            </div>
          )}
          {(uploaderId === userId || isCreator) &&
            !onEdit && (
              <DropdownButton
                alignLeft
                style={{ marginTop: '1.5rem' }}
                shape="button"
                icon="pencil"
                text="Edit or Delete This Video"
                menuProps={menuProps}
              />
            )}
        </div>
        {isCreator && (
          <StarButton
            style={{
              gridArea: 'starButton',
              alignSelf: 'end',
              justifySelf: 'end'
            }}
            isStarred={isStarred}
            onClick={() => starVideo(videoId)}
          />
        )}
        <div
          style={{
            gridArea: 'likeButton',
            alignSelf: 'end',
            justifySelf: 'end',
            width: '100%'
          }}
        >
          <LikeButton
            style={{
              fontSize: '2.5rem',
              width: '100%'
            }}
            onClick={this.onVideoLikeClick}
            liked={(likes => {
              let liked = false
              if (likes) {
                for (let i = 0; i < likes.length; i++) {
                  if (likes[i].userId === userId) liked = true
                }
              }
              return liked
            })(likes)}
          />
        </div>
        <div
          style={{
            gridArea: 'likers',
            alignSelf: 'start',
            textAlign: 'center'
          }}
        >
          <Likers
            userId={userId}
            likes={likes}
            onLinkClick={() => this.setState({ userListModalShown: true })}
            target="video"
            defaultText="Be the first to like this video"
          />
        </div>
        {userListModalShown && (
          <UserListModal
            onHide={() => this.setState({ userListModalShown: false })}
            title="People who liked this video"
            users={likes.map(like => {
              return {
                username: like.username,
                userId: like.userId
              }
            })}
            description="(You)"
          />
        )}
      </div>
    )
  }

  determineEditButtonDoneStatus() {
    const urlIsInvalid = !isValidYoutubeUrl(this.state.editedUrl)
    const titleIsEmpty = stringIsEmpty(this.state.editedTitle)
    const titleChanged = this.state.editedTitle !== this.props.title
    const urlChanged =
      this.state.editedUrl !==
      `https://www.youtube.com/watch?v=${this.props.content}`
    const descriptionChanged =
      this.state.editedDescription !== this.props.description
    const editDoneButtonDisabled =
      urlIsInvalid ||
      titleIsEmpty ||
      (!titleChanged && !descriptionChanged && !urlChanged)
    this.setState({ editDoneButtonDisabled })
  }

  onEditCancel() {
    const { description } = this.props
    const editedDescription =
      description === 'No description' ? '' : description
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
    this.props.onEditFinish(params).then(() =>
      this.setState({
        onEdit: false,
        editDoneButtonDisabled: true
      })
    )
  }

  onEditStart() {
    this.props.onEditStart()
    this.setState({ onEdit: true })
  }

  onMouseOver() {
    if (textIsOverflown(this.thumbLabel)) {
      this.setState({ onTitleHover: true })
    }
  }

  onVideoLikeClick() {
    const { videoId } = this.props
    this.props.likeVideo(videoId)
  }
}

export default connect(state => ({ isCreator: state.UserReducer.isCreator }), {
  starVideo
})(Description)
