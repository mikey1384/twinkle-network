import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Context from './Context';
import withContext from 'components/Wrappers/withContext';
import ContentLink from 'components/ContentLink';
import { timeSince } from 'helpers/timeStampHelpers';
import LikeButton from 'components/Buttons/LikeButton';
import { Color } from 'constants/css';
import ProfilePic from 'components/ProfilePic';
import Button from 'components/Button';
import SubjectModal from './SubjectModal';
import VideoThumbImage from 'components/VideoThumbImage';
import UsernameText from 'components/Texts/UsernameText';
import Icon from 'components/Icon';
import { uploadComment } from 'helpers/requestHelpers';
import { connect } from 'react-redux';

class Heading extends Component {
  static propTypes = {
    action: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
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
  };

  state = {
    subjectModalShown: false
  };

  render() {
    const {
      contentObj: {
        uploader = {},
        rootType,
        targetObj: { subject = {} } = {},
        timeStamp,
        type
      }
    } = this.props;
    const { subjectModalShown } = this.state;
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
            <span className="title">{this.renderHeading()}</span>
            <small className="timestamp">
              {timeStamp ? `(${timeSince(timeStamp)})` : ''}
            </small>
          </div>
          {type === 'comment' && rootType !== 'user' && (
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
        {subjectModalShown && (
          <SubjectModal
            onHide={() => this.setState({ subjectModalShown: false })}
            subject={subject}
            uploadResponse={this.onResponseUpload}
          />
        )}
      </header>
    );
  }

  renderHeading = () => {
    const {
      contentObj,
      contentObj: { id, rootObj = {}, type, uploader = {}, rootType },
      action
    } = this.props;
    const contentLabel =
      rootType === 'url'
        ? 'link'
        : rootType === 'subject'
        ? 'a subject'
        : rootType;
    switch (type) {
      case 'video':
        return (
          <>
            <UsernameText user={uploader} color={Color.blue()} /> uploaded a
            video: <ContentLink content={contentObj} type={type} />{' '}
          </>
        );
      case 'comment':
        return (
          <>
            <UsernameText user={uploader} color={Color.blue()} />{' '}
            <ContentLink
              content={{ id, title: action }}
              type={type}
              style={{ color: Color.green() }}
            />
            {this.renderTargetAction()} {contentLabel}:{' '}
            <ContentLink content={rootObj} type={rootType} />{' '}
          </>
        );
      case 'url':
        return (
          <>
            <UsernameText user={uploader} color={Color.blue()} /> shared a
            link:&nbsp;
            <ContentLink content={contentObj} type={type} />{' '}
          </>
        );
      case 'subject':
        return (
          <>
            <UsernameText user={uploader} color={Color.blue()} /> started a{' '}
            <ContentLink
              content={{ id, title: 'subject' }}
              type={type}
              style={{ color: Color.green() }}
            />
            {rootObj.id && (
              <>
                &nbsp;on {contentLabel}:{' '}
                <ContentLink content={rootObj} type={rootType} />{' '}
              </>
            )}
          </>
        );
      default:
        return <span>Error</span>;
    }
  };

  onResponseUpload = async({ content, subject }) => {
    const { dispatch, onCommentSubmit } = this.props;
    const data = await uploadComment({
      content,
      parent: subject,
      dispatch
    });
    if (data) onCommentSubmit(data);
  };

  renderCornerButton = () => {
    const {
      contentObj: {
        rootId,
        rootObj: { content, likes = [], difficulty } = {},
        rootType,
        subjectId
      },
      attachedVideoShown,
      myId,
      onPlayVideoClick
    } = this.props;
    const userLikedVideo = likes.map(like => like.id).indexOf(myId) !== -1;
    if (rootType === 'video') {
      if (!content) return null;
      return (
        <>
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
                <VideoThumbImage
                  playIcon
                  difficulty={difficulty}
                  height="7rem"
                  src={`https://img.youtube.com/vi/${content}/mqdefault.jpg`}
                />
              </div>
            )
          )}
        </>
      );
    } else if (subjectId) {
      return (
        <Button
          success
          onClick={() => this.setState({ subjectModalShown: true })}
        >
          <Icon icon="comment" />
          <span style={{ marginLeft: '0.7rem' }}>Respond</span>
        </Button>
      );
    }
  };

  renderTargetAction = () => {
    const {
      contentObj: { commentId, replyId, targetObj = {}, rootType }
    } = this.props;
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
      );
    }
    return null;
  };

  onLikeClick = likes => {
    const {
      contentObj: { rootId, rootType },
      onLikeContent
    } = this.props;
    onLikeContent({ likes, contentId: rootId, type: rootType });
  };
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(withContext({ Component: Heading, Context }));
