import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import Context from './Context'
import withContext from 'components/Wrappers/withContext'
import ContentLink from 'components/ContentLink'
import { timeSince } from 'helpers/timeStampHelpers'
import LikeButton from 'components/Buttons/LikeButton'
import { Color } from 'constants/css'
import ProfilePic from 'components/ProfilePic'
import Button from 'components/Button'
import QuestionModal from './QuestionModal'
import StarMark from 'components/StarMark'
import UsernameText from 'components/Texts/UsernameText'
import { css } from 'emotion'
import { connect } from 'react-redux'
import { likeContent, handleError } from 'helpers/requestHelpers'

class Heading extends Component {
  static propTypes = {
    action: PropTypes.string,
    onCommentSubmit: PropTypes.func.isRequired,
    onLikeContent: PropTypes.func.isRequired,
    attachedVideoShown: PropTypes.bool,
    contentObj: PropTypes.shape({
      id: PropTypes.number,
      commentId: PropTypes.number,
      replyId: PropTypes.number,
      rootObj: PropTypes.object,
      rootId: PropTypes.number,
      rootType: PropTypes.string,
      targetObj: PropTypes.object,
      timeStamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      type: PropTypes.string,
      uploader: PropTypes.object
    }).isRequired,
    myId: PropTypes.number,
    onPlayVideoClick: PropTypes.func
  }

  state = {
    questionModalShown: false
  }

  render() {
    const {
      contentObj: {
        uploader = {},
        rootObj = {},
        rootType,
        rootId,
        timeStamp,
        type
      },
      onCommentSubmit
    } = this.props
    const { questionModalShown } = this.state
    return (
      <header className="heading">
        <ProfilePic
          style={{ width: '6rem', height: '6rem' }}
          userId={uploader.id}
          profilePicId={uploader.profilePicId}
        />
        <div
          style={{
            width: '90%',
            height: '100%',
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
                  height: '8rem',
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
            question={root.content}
            uploadAnswer={onCommentSubmit}
            parent={{
              id: rootObj.id,
              type: rootType,
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
      contentObj,
      contentObj: { id, rootObj = {}, type, uploader = {}, rootType },
      action
    } = this.props
    const contentLabel =
      rootType === 'url'
        ? 'link'
        : rootType === 'question'
          ? 'a question'
          : rootType
    switch (type) {
      case 'video':
        return (
          <Fragment>
            <UsernameText user={uploader} color={Color.blue()} /> uploaded a
            video: <ContentLink content={contentObj} type={rootType} />{' '}
          </Fragment>
        )
      case 'comment':
        return (
          <Fragment>
            <UsernameText user={uploader} color={Color.blue()} />{' '}
            <ContentLink
              content={{ id, title: action }}
              type={type}
              style={{ color: Color.green() }}
            />
            {this.renderTargetAction()} {contentLabel}:{' '}
            <ContentLink content={rootObj} type={rootType} />{' '}
          </Fragment>
        )
      case 'url':
        return (
          <Fragment>
            <UsernameText user={uploader} color={Color.blue()} /> shared a
            link:&nbsp;
            <ContentLink content={contentObj} type={rootType} />{' '}
          </Fragment>
        )
      case 'question':
        return (
          <Fragment>
            <UsernameText user={uploader} color={Color.blue()} /> asked a{' '}
            <ContentLink
              content={{ id, title: 'question' }}
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
              content={{ id, title: 'discussion' }}
              type={type}
              style={{ color: Color.green() }}
            />
            &nbsp;on {contentLabel}:{' '}
            <ContentLink content={rootObj} type={rootType} />
          </Fragment>
        )
      default:
        return <span>Error</span>
    }
  }

  renderCornerButton = () => {
    const {
      contentObj: {
        rootObj: { content, likes = [], isStarred } = {},
        rootType
      },
      attachedVideoShown,
      myId,
      onPlayVideoClick
    } = this.props
    const userLikedVideo = likes.map(like => like.userId).indexOf(myId) !== -1
    if (!content) return null
    if (rootType === 'video') {
      return (
        <Fragment>
          {attachedVideoShown ? (
            <LikeButton
              small
              liked={userLikedVideo}
              onClick={this.onLikeClick}
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
                    <StarMark style={{ top: 1, left: 1 }} size={2.5} />
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
      contentObj: { commentId, replyId, targetObj = {} }
    } = this.props
    if (targetObj.comment && !targetObj.comment.notFound) {
      return (
        <span>
          {' '}
          <UsernameText
            user={targetObj.comment.uploader}
            color={Color.blue()}
          />
          {"'s "}
          <ContentLink
            content={{
              id: replyId || commentId,
              title: replyId ? 'reply ' : 'comment '
            }}
            type="comment"
            style={{ color: Color.green() }}
          />
          {'on'}
        </span>
      )
    }
    return null
  }

  onLikeClick = async() => {
    const {
      contentObj: { rootId, rootType },
      onLikeContent
    } = this.props
    const likes = await likeContent({ id: rootId, type: rootType, handleError })
    onLikeContent({ likes, contentId: rootId, type: rootType })
  }
}

export default connect(
  null,
  dispatch => ({
    handleError: error => handleError(error, dispatch)
  })
)(withContext({ Component: Heading, Context }))
