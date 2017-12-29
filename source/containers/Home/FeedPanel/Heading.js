import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import UserLink from '../UserLink'
import ContentLink from 'components/ContentLink'
import { timeSince } from 'helpers/timeStampHelpers'
import LikeButton from 'components/LikeButton'
import { connect } from 'react-redux'
import { contentFeedLike } from 'redux/actions/FeedActions'
import { Color } from 'constants/css'
import ProfilePic from 'components/ProfilePic'
import Button from 'components/Button'
import QuestionModal from './QuestionModal'
import StarMark from 'components/StarMark'

class Heading extends Component {
  static propTypes = {
    action: PropTypes.string,
    attachedVideoShown: PropTypes.bool,
    feed: PropTypes.shape({
      rootContentLikers: PropTypes.array,
      rootId: PropTypes.number,
      rootType: PropTypes.string.isRequired,
      timeStamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
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

  state = {
    questionModalShown: false
  }

  render() {
    const { feed: { uploaderPicId }, uploader } = this.props
    return (
      <div
        className="panel-heading"
        style={{ display: 'flex', alignItems: 'center', width: '100%' }}
      >
        <ProfilePic
          style={{ width: '8%' }}
          userId={uploader.id}
          profilePicId={uploaderPicId}
        />
        <div
          style={{
            width: '90%',
            marginLeft: '2%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {this.renderHeading()}
        </div>
      </div>
    )
  }

  renderHeading = () => {
    const {
      feed: { type, rootType, rootId, timeStamp },
      action,
      rootContent,
      uploader
    } = this.props
    const { questionModalShown } = this.state
    const contentLabel = rootType === 'url' ? 'link' : rootType
    switch (type) {
      case 'video':
        return (
          <Fragment>
            <span className="panel-title">
              <UserLink user={uploader} /> uploaded a video:{' '}
              <ContentLink content={rootContent} type={rootType} />{' '}
              <small>{timeStamp ? `(${timeSince(timeStamp)})` : ''}</small>
            </span>
          </Fragment>
        )
      case 'comment':
        return (
          <Fragment>
            <div className="panel-title" style={{ width: '80%' }}>
              <UserLink user={uploader} /> {action} {this.renderTargetAction()}{' '}
              {contentLabel}:{' '}
              <ContentLink content={rootContent} type={rootType} />{' '}
              <small>({timeSince(timeStamp)})</small>
            </div>
            <div
              style={{
                width: '20%',
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              {this.renderCornerButton()}
            </div>
            {questionModalShown && (
              <QuestionModal
                onHide={() => this.setState({ questionModalShown: false })}
                question={rootContent.content}
                parent={{
                  id: rootId,
                  type: 'question',
                  rootId,
                  rootType
                }}
              />
            )}
          </Fragment>
        )
      case 'url':
        return (
          <Fragment>
            <span className="panel-title">
              <UserLink user={uploader} /> shared a link:&nbsp;
              <ContentLink content={rootContent} type={rootType} />
              <small>{timeStamp ? ` (${timeSince(timeStamp)})` : ''}</small>
            </span>
          </Fragment>
        )
      case 'question':
        return (
          <Fragment>
            <span className="panel-title">
              <UserLink user={uploader} /> asked a{' '}
              <b style={{ color: Color.green }}>question</b>
              <small>{timeStamp ? ` (${timeSince(timeStamp)})` : ''}</small>
            </span>
          </Fragment>
        )
      case 'discussion':
        return (
          <Fragment>
            <span className="panel-title">
              <UserLink user={uploader} /> started a{' '}
              <b style={{ color: Color.green }}>discussion</b> on {contentLabel}:{' '}
              <ContentLink content={rootContent} type={rootType} />
              <small>{timeStamp ? ` (${timeSince(timeStamp)})` : ''}</small>
            </span>
          </Fragment>
        )
      default:
        return <span>Error</span>
    }
  }

  renderCornerButton = () => {
    const {
      feed: { rootContentLikers = [], rootId, rootType },
      rootContent: { content, isStarred },
      attachedVideoShown,
      myId,
      onLikeClick,
      onPlayVideoClick
    } = this.props
    const userLikedVideo =
      rootContentLikers.map(liker => liker.userId).indexOf(myId) !== -1
    if (rootType === 'video') {
      return (
        <Fragment>
          {attachedVideoShown ? (
            <LikeButton
              small
              targetLabel="Video"
              liked={userLikedVideo}
              onClick={() => onLikeClick(rootId, rootType)}
            />
          ) : (
            content && (
              <a
                style={{
                  marginLeft: 'auto',
                  float: 'right',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: Color.blue
                }}
                onClick={onPlayVideoClick}
              >
                <div className="video-preview-thumb">
                  <img
                    alt="thumb"
                    style={{ width: '12rem' }}
                    src={`https://img.youtube.com/vi/${content}/mqdefault.jpg`}
                  />
                  {!!isStarred && (
                    <StarMark style={{ top: 1, left: 1 }} size={2} />
                  )}
                  <span />
                </div>
              </a>
            )
          )}
        </Fragment>
      )
    } else if (rootType === 'question') {
      return (
        <Button
          className="btn btn-success"
          onClick={() => this.setState({ questionModalShown: true })}
        >
          Answer
        </Button>
      )
    }
  }

  renderTargetAction = () => {
    const { targetReplyUploader, targetCommentUploader } = this.props
    if (targetReplyUploader) {
      return (
        <span>
          <UserLink user={targetReplyUploader} />
          {"'s reply on"}
        </span>
      )
    } else if (targetCommentUploader) {
      return (
        <span>
          <UserLink user={targetCommentUploader} />
          {"'s comment on"}
        </span>
      )
    }
    return null
  }
}

export default connect(null, { onLikeClick: contentFeedLike })(Heading)
