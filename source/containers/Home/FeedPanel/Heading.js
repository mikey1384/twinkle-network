import PropTypes from 'prop-types'
import React, {Component} from 'react'
import UserLink from '../UserLink'
import ContentLink from 'components/ContentLink'
import {timeSince} from 'helpers/timeStampHelpers'
import LikeButton from 'components/LikeButton'
import {connect} from 'react-redux'
import {contentFeedLike} from 'redux/actions/FeedActions'
import {Color} from 'constants/css'
import ProfilePic from 'components/ProfilePic'
import Button from 'components/Button'
import QuestionModal from './QuestionModal'

class Heading extends Component {
  static propTypes = {
    action: PropTypes.string,
    attachedVideoShown: PropTypes.bool,
    feed: PropTypes.shape({
      rootContentLikers: PropTypes.array,
      rootId: PropTypes.number,
      rootType: PropTypes.string.isRequired,
      timeStamp: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]).isRequired,
      type: PropTypes.string.isRequired,
      uploaderPicId: PropTypes.number
    }).isRequired,
    myId: PropTypes.number,
    onLikeClick: PropTypes.func.isRequired,
    onPlayVideoClick: PropTypes.func,
    rootContent: PropTypes.shape({
      content: PropTypes.string
    }).isRequired,
    targetReplyUploader: PropTypes.object,
    targetCommentUploader: PropTypes.object,
    uploader: PropTypes.object
  }

  constructor() {
    super()
    this.state = {
      questionModalShown: false
    }
    this.renderCornerButton = this.renderCornerButton.bind(this)
    this.renderTargetAction = this.renderTargetAction.bind(this)
  }

  render() {
    const {
      feed: {
        type,
        rootType,
        uploaderPicId,
        rootId,
        timeStamp
      },
      action,
      rootContent,
      uploader
    } = this.props
    const {questionModalShown} = this.state
    const contentLabel = rootType === 'url' ? 'link' : rootType
    const spanStyle = {fontSize: '1.4rem'}

    switch (type) {
      case 'video':
        return (
          <div className="panel-heading flexbox-container" style={{paddingLeft: '0.8em'}}>
            <ProfilePic size='3' userId={uploader.id} profilePicId={uploaderPicId} />
            <span className="panel-title pull-left" style={spanStyle}>
              <UserLink user={uploader} /> uploaded a video: <ContentLink content={rootContent} type={rootType} /> <small>{timeStamp ? `(${timeSince(timeStamp)})` : ''}</small>
            </span>
          </div>
        )
      case 'comment':
        return (
          <div className="panel-heading flexbox-container" style={{paddingLeft: '0.8em'}}>
            {questionModalShown && <QuestionModal
              onHide={() => this.setState({questionModalShown: false})}
              question={rootContent.content}
              parent={{
                id: rootId,
                type: 'question',
                rootId,
                rootType
              }}
            />}
            <ProfilePic size='3' userId={uploader.id} profilePicId={uploaderPicId} />
            <span className="panel-title pull-left col-xs-9" style={{...spanStyle, padding: '0px'}}>
              <UserLink user={uploader} /> {action} {this.renderTargetAction()} {contentLabel}: <ContentLink content={rootContent} type={rootType} /> <small>({timeSince(timeStamp)})</small>
            </span>
            {this.renderCornerButton()}
          </div>
        )
      case 'url':
        return (
          <div className="panel-heading flexbox-container" style={{paddingLeft: '0.8em'}}>
            <ProfilePic size='3' userId={uploader.id} profilePicId={uploaderPicId} />
            <span className="panel-title pull-left" style={spanStyle}>
              <UserLink user={uploader} /> shared a link:&nbsp;
              <ContentLink content={rootContent} type={rootType}/>
              <small>{timeStamp ? ` (${timeSince(timeStamp)})` : ''}</small>
            </span>
          </div>
        )
      case 'question':
        return (
          <div className="panel-heading flexbox-container" style={{paddingLeft: '0.8em'}}>
            <ProfilePic size='3' userId={uploader.id} profilePicId={uploaderPicId} />
            <span className="panel-title pull-left" style={spanStyle}>
              <UserLink user={uploader} /> asked a <b style={{color: Color.green}}>question</b>
              <small>{timeStamp ? ` (${timeSince(timeStamp)})` : ''}</small>
            </span>
          </div>
        )
      case 'discussion':
        return (
          <div className="panel-heading flexbox-container" style={{paddingLeft: '0.8em'}}>
            <ProfilePic size='3' userId={uploader.id} profilePicId={uploaderPicId} />
            <span className="panel-title pull-left" style={spanStyle}>
              <UserLink user={uploader} /> started a <b style={{color: Color.green}}>discussion</b> on {contentLabel}: <ContentLink content={rootContent} type={rootType}/>
              <small>{timeStamp ? ` (${timeSince(timeStamp)})` : ''}</small>
            </span>
          </div>
        )
      default:
        return <div className="panpanel-heading flexbox-container">Error</div>
    }
  }

  renderCornerButton() {
    const {
      feed: {rootContentLikers = [], rootId, rootType},
      rootContent: {content, isStarred},
      attachedVideoShown, myId, onLikeClick, onPlayVideoClick
    } = this.props
    const userLikedVideo = rootContentLikers.map(liker => liker.userId).indexOf(myId) !== -1
    if (rootType === 'video') {
      return <div>
        {attachedVideoShown ?
          <LikeButton
            small
            style={{
              marginLeft: 'auto',
              float: 'right'
            }}
            targetLabel="Video"
            liked={userLikedVideo}
            onClick={() => onLikeClick(rootId, rootType)}
          /> : (
            content && <a
              style={{
                marginLeft: 'auto',
                float: 'right',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: Color.blue
              }}
              onClick={onPlayVideoClick}
            >
              <div className="video-preview-thumb" style={{width: '7em'}}>
                <img
                  alt=""
                  style={{width: '7em'}}
                  src={`https://img.youtube.com/vi/${content}/mqdefault.jpg`}
                />
                {isStarred &&
                  <div style={{
                    position: 'absolute',
                    color: 'red'
                  }}>
                    This is starred
                  </div>
                }
                <span></span>
              </div>
            </a>
          )
        }
      </div>
    } else if (rootType === 'question') {
      return (
        <Button
          className="btn btn-success"
          style={{
            marginLeft: 'auto',
            float: 'right'
          }}
          onClick={() => this.setState({questionModalShown: true})}
        >
          Answer
        </Button>
      )
    }
  }

  renderTargetAction() {
    const {targetReplyUploader, targetCommentUploader} = this.props
    if (targetReplyUploader) {
      return <span><UserLink user={targetReplyUploader} />{"'s reply on"}</span>
    } else if (targetCommentUploader) {
      return <span><UserLink user={targetCommentUploader} />{"'s comment on"}</span>
    }
    return null
  }
}

export default connect(
  null,
  {onLikeClick: contentFeedLike}
)(Heading)
