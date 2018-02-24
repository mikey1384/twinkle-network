import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import ContentLink from 'components/ContentLink'
import { timeSince } from 'helpers/timeStampHelpers'
import LikeButton from 'components/LikeButton'
import { Color } from 'constants/css'
import ProfilePic from 'components/ProfilePic'
import Button from 'components/Button'
import QuestionModal from './QuestionModal'
import StarMark from 'components/StarMark'
import UsernameText from 'components/Texts/UsernameText'
import { css } from 'emotion'

export default class Heading extends Component {
  static propTypes = {
    action: PropTypes.string,
    methods: PropTypes.shape({
      onUploadAnswer: PropTypes.func.isRequired,
      onLikeClick: PropTypes.func.isRequired
    }),
    attachedVideoShown: PropTypes.bool,
    contentObj: PropTypes.shape({
      contentId: PropTypes.number,
      commentId: PropTypes.number,
      replyId: PropTypes.number,
      rootContentLikers: PropTypes.array,
      rootId: PropTypes.number,
      rootType: PropTypes.string,
      timeStamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      type: PropTypes.string.isRequired,
      uploaderPicId: PropTypes.number
    }).isRequired,
    myId: PropTypes.number,
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
    const {
      contentObj: { type, uploaderPicId, rootType, rootId, timeStamp },
      uploader,
      rootContent,
      methods
    } = this.props
    const { questionModalShown } = this.state
    return (
      <header className="heading">
        <ProfilePic
          style={{ width: '8%', height: '8%' }}
          userId={uploader.id}
          profilePicId={uploaderPicId}
        />
        <div
          style={{
            width: '90%',
            height: '100%',
            marginLeft: '2%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div
            style={{
              width: type === 'comment' && rootType !== 'url' ? '78%' : '100%'
            }}
          >
            <span className="title">{this.renderHeading()} </span>
            <small className="timestamp">
              {timeStamp ? `(${timeSince(timeStamp)})` : ''}
            </small>
          </div>
          {type === 'comment' &&
            rootType !== 'url' && (
              <div
                style={{
                  width: '20%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end'
                }}
              >
                {this.renderCornerButton()}
              </div>
            )}
        </div>
        {questionModalShown && (
          <QuestionModal
            onHide={() => this.setState({ questionModalShown: false })}
            question={rootContent.content}
            uploadAnswer={methods.onUploadAnswer}
            parent={{
              id: rootId,
              type: 'question',
              rootId,
              rootType
            }}
          />
        )}
      </header>
    )
  }

  renderHeading = () => {
    const {
      contentObj: { contentId, type, rootType },
      action,
      rootContent,
      uploader
    } = this.props
    const contentLabel = rootType === 'url' ? 'link' : rootType
    switch (type) {
      case 'video':
        return (
          <Fragment>
            <UsernameText user={uploader} color={Color.blue()} /> uploaded a
            video: <ContentLink content={rootContent} type={rootType} />{' '}
          </Fragment>
        )
      case 'comment':
        return (
          <Fragment>
            <UsernameText user={uploader} color={Color.blue()} />{' '}
            <ContentLink
              content={{ id: contentId, title: action }}
              type={type}
              style={{ color: Color.green() }}
            />{' '}
            {this.renderTargetAction()} {contentLabel}:{' '}
            <ContentLink content={rootContent} type={rootType} />{' '}
          </Fragment>
        )
      case 'url':
        return (
          <Fragment>
            <UsernameText user={uploader} color={Color.blue()} /> shared a
            link:&nbsp;
            <ContentLink content={rootContent} type={rootType} />{' '}
          </Fragment>
        )
      case 'question':
        return (
          <Fragment>
            <UsernameText user={uploader} color={Color.blue()} /> asked a{' '}
            <ContentLink
              content={{ id: contentId, title: 'question' }}
              type={type}
              style={{ color: Color.green() }}
            />{' '}
          </Fragment>
        )
      case 'discussion':
        return (
          <Fragment>
            <UsernameText user={uploader} color={Color.blue()} /> started a{' '}
            <ContentLink
              content={{ id: contentId, title: 'discussion' }}
              type={type}
              style={{ color: Color.green() }}
            />
            &nbsp;on {contentLabel}:{' '}
            <ContentLink content={rootContent} type={rootType} />
          </Fragment>
        )
      default:
        return <span>Error</span>
    }
  }

  renderCornerButton = () => {
    const {
      contentObj: { rootContentLikers = [], rootId, rootType },
      rootContent: { content, isStarred },
      attachedVideoShown,
      myId,
      methods,
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
              liked={userLikedVideo}
              onClick={() => methods.onLikeClick(rootId, rootType)}
            />
          ) : (
            content && (
              <div
                style={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: Color.blue(),
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={onPlayVideoClick}
              >
                <div
                  className={css`
                    background-image: url(https://img.youtube.com/vi/${content}/mqdefault.jpg);
                    background-size: cover;
                    background-repeat: no-repeat;
                    position: relative;
                    width: 100%;
                    height: 85%;
                  `}
                >
                  {!!isStarred && (
                    <StarMark style={{ top: 1, left: 1 }} size={2} />
                  )}
                  <span />
                  <a
                    className={css`
                      position: absolute;
                      display: block;
                      background: url('/img/play-button-image.png');
                      background-size: contain;
                      height: 3rem;
                      width: 3rem;
                      top: 50%;
                      left: 50%;
                      margin: -1.5rem 0 0 -1.5rem;
                    `}
                  />
                </div>
              </div>
            )
          )}
        </Fragment>
      )
    } else if (rootType === 'question') {
      return (
        <Button
          success
          onClick={() => this.setState({ questionModalShown: true })}
        >
          <span className="glyphicon glyphicon-comment" />&nbsp;Answer
        </Button>
      )
    }
  }

  renderTargetAction = () => {
    const {
      contentObj: { commentId, replyId },
      targetReplyUploader,
      targetCommentUploader
    } = this.props
    if (targetReplyUploader) {
      return (
        <span>
          <UsernameText user={targetReplyUploader} color={Color.blue()} />
          {"'s "}
          <ContentLink
            content={{ id: replyId, title: 'reply ' }}
            type="comment"
            style={{ color: Color.green() }}
          />
          {'on'}
        </span>
      )
    } else if (targetCommentUploader) {
      return (
        <span>
          <UsernameText user={targetCommentUploader} color={Color.blue()} />
          {"'s "}
          <ContentLink
            content={{ id: commentId, title: 'comment ' }}
            type="comment"
            style={{ color: Color.green() }}
          />
          {'on'}
        </span>
      )
    }
    return null
  }
}
