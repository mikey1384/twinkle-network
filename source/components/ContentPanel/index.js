import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Context from './Context';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import withContext from 'components/Wrappers/withContext';
import Heading from './Heading';
import Body from './Body';
import Loading from 'components/Loading';
import { container } from './Styles';
import request from 'axios';
import { URL } from 'constants/URL';

class ContentPanel extends Component {
  static propTypes = {
    autoExpand: PropTypes.bool,
    commentsLoadLimit: PropTypes.number,
    contentObj: PropTypes.object.isRequired,
    inputAtBottom: PropTypes.bool,
    userId: PropTypes.number,
    onAddTags: PropTypes.func,
    onAddTagToContents: PropTypes.func,
    onAttachStar: PropTypes.func.isRequired,
    onCommentSubmit: PropTypes.func.isRequired,
    onDeleteComment: PropTypes.func.isRequired,
    onDeleteContent: PropTypes.func.isRequired,
    onEditComment: PropTypes.func.isRequired,
    onEditContent: PropTypes.func.isRequired,
    onEditRewardComment: PropTypes.func.isRequired,
    onLikeContent: PropTypes.func.isRequired,
    onLoadContent: PropTypes.func,
    onLoadMoreComments: PropTypes.func.isRequired,
    onLoadMoreReplies: PropTypes.func.isRequired,
    onLoadTags: PropTypes.func,
    onLoadRepliesOfReply: PropTypes.func,
    onReplySubmit: PropTypes.func.isRequired,
    onSetDifficulty: PropTypes.func,
    onShowComments: PropTypes.func.isRequired,
    onByUserStatusChange: PropTypes.func,
    onTargetCommentSubmit: PropTypes.func.isRequired
  };

  state = {
    attachedVideoShown: false,
    feedLoaded: false
  };

  async componentDidMount() {
    const {
      contentObj: { contentId, feedId, newPost, type },
      onLoadContent
    } = this.props;
    const { feedLoaded } = this.state;
    if (!feedLoaded && !newPost) {
      this.setState({ feedLoaded: true });
      const { data } = await request.get(
        `${URL}/content?contentId=${contentId}&type=${type}`
      );
      onLoadContent({ data, feedId });
    }
  }

  render() {
    const {
      autoExpand,
      commentsLoadLimit,
      contentObj,
      inputAtBottom,
      onAddTags,
      onAddTagToContents,
      onAttachStar,
      onByUserStatusChange,
      onCommentSubmit,
      onDeleteComment,
      onDeleteContent,
      onEditComment,
      onEditContent,
      onEditRewardComment,
      onLikeContent,
      onLoadMoreComments,
      onLoadMoreReplies,
      onLoadTags,
      onLoadRepliesOfReply,
      onReplySubmit,
      onSetDifficulty,
      onShowComments,
      onTargetCommentSubmit,
      userId
    } = this.props;
    const { attachedVideoShown } = this.state;
    return (
      <Context.Provider
        value={{
          commentsLoadLimit,
          onAddTags,
          onAddTagToContents,
          onAttachStar,
          onByUserStatusChange,
          onCommentSubmit,
          onDeleteComment,
          onDeleteContent,
          onEditComment,
          onEditContent,
          onEditRewardComment,
          onLikeContent,
          onLoadMoreComments,
          onLoadMoreReplies,
          onLoadTags,
          onLoadRepliesOfReply,
          onReplySubmit,
          onSetDifficulty,
          onShowComments,
          onTargetCommentSubmit
        }}
      >
        <div
          className={container}
          style={{ height: !contentObj.loaded && '15rem' }}
        >
          {!contentObj.loaded && <Loading />}
          {contentObj.loaded && (
            <Heading
              contentObj={contentObj}
              myId={userId}
              action={
                contentObj.commentId
                  ? contentObj.targetObj.comment.notFound
                    ? 'replied on'
                    : 'replied to'
                  : contentObj.rootType === 'question'
                  ? 'responded to'
                  : contentObj.rootType === 'user'
                  ? 'left a message to'
                  : 'commented on'
              }
              onPlayVideoClick={() =>
                this.setState({ attachedVideoShown: true })
              }
              attachedVideoShown={attachedVideoShown}
            />
          )}
          <ErrorBoundary>
            <div className="body">
              {contentObj.loaded && (
                <Body
                  autoExpand={autoExpand}
                  contentObj={contentObj}
                  inputAtBottom={inputAtBottom}
                  attachedVideoShown={attachedVideoShown}
                  myId={userId}
                />
              )}
            </div>
          </ErrorBoundary>
        </div>
      </Context.Provider>
    );
  }
}

export default withContext({ Component: ContentPanel, Context });
