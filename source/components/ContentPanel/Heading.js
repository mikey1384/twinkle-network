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
import Icon from 'components/Icon'
import { uploadComment } from 'helpers/requestHelpers'
import { css } from 'emotion'
import { connect } from 'react-redux'

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
      }
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
            justifyContent: 'space-between',
            marginLeft: '1rem'
          }}
        >
          <div
            style={{
              width:
                type === 'comment' && rootType !== 'url' && rootType !== 'user'
                  ? '78%'
                  : '100%'
            }}
          >
            <span className="title">{this.renderHeading()} </span>
            <small className="timestamp">
              {timeStamp ? `(${timeSince(timeStamp)})` : ''}
            </small>
          </div>
          {type === 'comment' &&
            rootType !== 'url' &&
            rootType !== 'user' && (
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
            question={rootObj.content}
            uploadAnswer={this.onAnswerUpload}
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
            video: <ContentLink content={contentObj} type={type} />{' '}
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
            <ContentLink content={contentObj} type={type} />{' '}
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

  onAnswerUpload = async({ content, parent }) => {
    const { dispatch, onCommentSubmit } = this.props
    const data = await uploadComment({
      content,
      parent,
      dispatch
    })
    if (data) onCommentSubmit(data)
  }

  renderCornerButton = () => {
    const {
      contentObj: {
        rootId,
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
              contentType="video"
              contentId={rootId}
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
          <Icon icon="comment" />
          <span style={{ marginLeft: '0.7rem' }}>Answer</span>
        </Button>
      )
    }
  }

  renderTargetAction = () => {
    const {
      contentObj: { commentId, replyId, targetObj = {}, rootType }
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
              title: replyId
                ? 'reply '
                : rootType === 'user'
                  ? 'message '
                  : 'comment '
            }}
            type="comment"
            style={{ color: Color.green() }}
          />
          {!replyId && rootType === 'user' ? 'to' : 'on'}
        </span>
      )
    }
    return null
  }

  onLikeClick = likes => {
    const {
      contentObj: { rootId, rootType },
      onLikeContent
    } = this.props
    onLikeContent({ likes, contentId: rootId, type: rootType })
  }
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(withContext({ Component: Heading, Context }))
