import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Context from '../../Context';
import withContext from 'components/Wrappers/withContext';
import UsernameText from 'components/Texts/UsernameText';
import Button from 'components/Button';
import LikeButton from 'components/Buttons/LikeButton';
import Likers from 'components/Likers';
import { connect } from 'react-redux';
import UserListModal from 'components/Modals/UserListModal';
import InputForm from 'components/Texts/InputForm';
import Comment from './Comment';
import { borderRadius, Color } from 'constants/css';
import LongText from 'components/Texts/LongText';
import ContentLink from 'components/ContentLink';
import { timeSince } from 'helpers/timeStampHelpers';
import RewardStatus from 'components/RewardStatus';
import XPRewardInterface from 'components/XPRewardInterface';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import Icon from 'components/Icon';
import { determineXpButtonDisabled } from 'helpers';
import { uploadComment } from 'helpers/requestHelpers';
import { css } from 'emotion';

class TargetContent extends Component {
  static propTypes = {
    authLevel: PropTypes.number,
    canStar: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    feedId: PropTypes.number,
    myId: PropTypes.number,
    onAttachStar: PropTypes.func.isRequired,
    onDeleteComment: PropTypes.func.isRequired,
    onEditComment: PropTypes.func.isRequired,
    onEditRewardComment: PropTypes.func.isRequired,
    onLikeContent: PropTypes.func.isRequired,
    onTargetCommentSubmit: PropTypes.func.isRequired,
    profilePicId: PropTypes.number,
    rootObj: PropTypes.object,
    rootType: PropTypes.string.isRequired,
    targetObj: PropTypes.object,
    username: PropTypes.string
  };

  state = {
    userListModalShown: false,
    replyInputShown: false,
    xpRewardInterfaceShown: false
  };

  render() {
    const {
      authLevel,
      canStar,
      myId,
      onAttachStar,
      onDeleteComment,
      onEditComment,
      onEditRewardComment,
      rootObj,
      profilePicId,
      rootType,
      targetObj: {
        discussion,
        comment,
        comment: { comments = [], stars = [] } = {},
        type
      },
      username
    } = this.props;
    const {
      userListModalShown,
      replyInputShown,
      xpRewardInterfaceShown
    } = this.state;
    let userLikedThis = false;
    let userIsUploader;
    let userCanStarThis;
    let uploader = {};
    if (comment && !comment.notFound) {
      uploader = comment.uploader;
      for (let i = 0; i < comment.likes.length; i++) {
        if (comment.likes[i].id === myId) userLikedThis = true;
      }
      userIsUploader = myId === comment.uploader.id;
      userCanStarThis =
        !userIsUploader && canStar && authLevel > comment.uploader.authLevel;
    } else {
      uploader = (discussion || {}).uploader || uploader;
    }
    return (
      <ErrorBoundary
        className={css`
          font-size: 1.6rem;
          white-space: pre-wrap;
          overflow-wrap: break-word;
          word-break: break-word;
          border-radius: ${borderRadius};
          border-top: 1px solid ${Color.inputBorderGray()};
          border-bottom: 1px solid ${Color.inputBorderGray()};
          padding-top: 1rem;
          padding-right: 0;
          padding-left: 0;
          background: ${Color.wellGray()};
          margin-bottom: 2rem;
          line-height: 1.5;
          .buttons {
            margin-top: 2rem;
            display: flex;
            width: 100%;
            justify-content: space-between;
          }
          .detail-block {
            display: flex;
            justify-content: space-between;
          }
          .root-content {
            color: ${Color.darkGray()};
            font-weight: bold;
          }
          .timestamp {
            color: ${Color.gray()};
            font-size: 1.2rem;
          }
        `}
        style={{
          paddingBottom:
            stars &&
            stars.length > 0 &&
            !replyInputShown &&
            !xpRewardInterfaceShown
              ? 0
              : '1rem'
        }}
      >
        <div>
          {discussion &&
            (discussion.notFound ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <span>Subject removed / no longer available</span>
              </div>
            ) : (
              <div style={{ padding: '0.5rem 1rem' }}>
                <div
                  className={css`
                    display: flex;
                    flex-direction: column;
                  `}
                >
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <ContentLink
                        content={{ id: discussion.id, title: 'Subject: ' }}
                        type="discussion"
                        style={{ color: Color.green() }}
                      />
                    </div>
                    <div>
                      <UsernameText user={discussion.uploader} />
                      &nbsp;
                      <span className="timestamp">
                        ({timeSince(discussion.timeStamp)})
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="root-content">{discussion.title}</span>
                  </div>
                </div>
                <div>
                  {discussion.description && type === 'discussion' && (
                    <LongText
                      className={css`
                        margin-top: 1rem;
                      `}
                    >
                      {discussion.description}
                    </LongText>
                  )}
                </div>
              </div>
            ))}
          {comment &&
            (comment.notFound ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <span>Comment removed / no longer available</span>
              </div>
            ) : (
              <div style={{ marginTop: discussion ? '1rem' : 0 }}>
                {rootType === 'question' && (
                  <div style={{ padding: '0.5rem 1rem 1.5rem 1rem' }}>
                    <ContentLink
                      style={{ color: Color.green() }}
                      content={{ id: rootObj.id, title: 'Subject: ' }}
                      type="question"
                    />
                    <span className="root-content">{rootObj.content}</span>
                  </div>
                )}
                <div style={{ padding: '0 1rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div className="detail-block">
                      <div>
                        <UsernameText
                          user={comment.uploader}
                          color={Color.blue()}
                        />{' '}
                        <ContentLink
                          content={{
                            id: comment.id,
                            title: `${
                              type === 'reply'
                                ? 'replied'
                                : type === 'comment'
                                ? 'commented'
                                : type === 'discussion'
                                ? 'responded'
                                : 'answered'
                            }:`
                          }}
                          type="comment"
                          style={{ color: Color.green() }}
                        />
                      </div>
                      <div>
                        <span className="timestamp">
                          ({timeSince(comment.timeStamp)})
                        </span>
                      </div>
                    </div>
                    <LongText style={{ marginTop: '1rem' }}>
                      {comment.content}
                    </LongText>
                  </div>
                  <ErrorBoundary className="buttons">
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          marginBottom: comment.likes.length > 0 ? '0.5rem' : 0
                        }}
                      >
                        <LikeButton
                          contentType="comment"
                          contentId={comment.id}
                          onClick={this.onLikeClick}
                          liked={userLikedThis}
                          small
                        />
                        <Button
                          style={{ marginLeft: '1rem' }}
                          transparent
                          onClick={this.onReplyClick}
                        >
                          <Icon icon="comment-alt" />
                          <span style={{ marginLeft: '0.7rem' }}>Reply</span>
                        </Button>
                      </div>
                      <Likers
                        className="content-panel__likes"
                        userId={myId}
                        likes={comment.likes}
                        onLinkClick={() =>
                          this.setState({ userListModalShown: true })
                        }
                      />
                    </div>
                    <div>
                      {canStar && userCanStarThis && (
                        <Button
                          love
                          disabled={this.determineXpButtonDisabled()}
                          onClick={() =>
                            this.setState({ xpRewardInterfaceShown: true })
                          }
                        >
                          <Icon icon="certificate" />
                          <span style={{ marginLeft: '0.7rem' }}>
                            {this.determineXpButtonDisabled() || 'Reward'}
                          </span>
                        </Button>
                      )}
                    </div>
                  </ErrorBoundary>
                </div>
                {xpRewardInterfaceShown && (
                  <XPRewardInterface
                    contentType={'comment'}
                    contentId={comment.id}
                    difficulty={
                      rootObj.difficulty || (discussion || {}).difficulty
                    }
                    uploaderId={comment.uploader.id}
                    stars={comment.stars}
                    onRewardSubmit={data => {
                      this.setState({ xpRewardInterfaceShown: false });
                      onAttachStar(data);
                    }}
                  />
                )}
                <RewardStatus
                  difficulty={
                    rootObj.difficulty || (discussion || {}).difficulty
                  }
                  onCommentEdit={onEditRewardComment}
                  style={{
                    marginTop:
                      comment.likes.length > 0 || xpRewardInterfaceShown
                        ? '0.5rem'
                        : '1rem'
                  }}
                  stars={comment.stars}
                  uploaderName={uploader.username}
                />
                {replyInputShown && (
                  <InputForm
                    innerRef={ref => (this.InputForm = ref)}
                    style={{
                      marginTop: comment.likes.length > 0 ? '0.5rem' : '1rem',
                      padding: '0 1rem'
                    }}
                    autoFocus
                    onSubmit={this.onSubmit}
                    rows={4}
                    placeholder={`Write a reply...`}
                  />
                )}
                {comments.length > 0 && (
                  <div style={{ padding: '0 1rem' }}>
                    {comments.map(comment => (
                      <Comment
                        key={comment.id}
                        comment={comment}
                        username={username}
                        userId={myId}
                        profilePicId={profilePicId}
                        onDelete={onDeleteComment}
                        onEditDone={onEditComment}
                      />
                    ))}
                  </div>
                )}
                {userListModalShown && (
                  <UserListModal
                    onHide={() => this.setState({ userListModalShown: false })}
                    title="People who liked this comment"
                    users={comment.likes}
                    description="(You)"
                  />
                )}
              </div>
            ))}
        </div>
      </ErrorBoundary>
    );
  }

  determineXpButtonDisabled = () => {
    const {
      targetObj: { type, comment, discussion },
      myId,
      rootObj
    } = this.props;
    const { xpRewardInterfaceShown } = this.state;
    const stars =
      type === 'comment' || type === 'reply' ? comment.stars : discussion.stars;
    return determineXpButtonDisabled({
      difficulty: rootObj.difficulty || (discussion || {}).difficulty,
      stars,
      myId,
      xpRewardInterfaceShown
    });
  };

  onLikeClick = likes => {
    const {
      targetObj: { comment },
      onLikeContent
    } = this.props;
    onLikeContent({ likes, type: 'comment', contentId: comment.id });
  };

  onReplyClick = () => {
    const { replyInputShown } = this.state;
    if (!replyInputShown) return this.setState({ replyInputShown: true });
    this.InputForm.focus();
  };

  onSubmit = async content => {
    const {
      dispatch,
      feedId,
      rootType,
      rootObj,
      targetObj: { comment = {} },
      onTargetCommentSubmit
    } = this.props;
    const data = await uploadComment({
      content,
      parent: {
        type: rootType,
        id: rootObj.id
      },
      rootCommentId: comment.commentId,
      targetCommentId: comment.id,
      dispatch
    });
    if (data) onTargetCommentSubmit(data, feedId);
  };
}

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
    canStar: state.UserReducer.canStar,
    username: state.UserReducer.username,
    profilePicId: state.UserReducer.profilePicId
  }),
  dispatch => ({ dispatch })
)(withContext({ Component: TargetContent, Context }));
