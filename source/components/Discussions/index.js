import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DiscussionPanel from './DiscussionPanel';
import DiscussionInputArea from './DiscussionInputArea';
import Button from 'components/Button';
import Context from './Context';
import { loadDiscussions } from 'helpers/requestHelpers';

export default class Discussions extends Component {
  static propTypes = {
    className: PropTypes.string,
    contentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    discussions: PropTypes.array,
    loadMoreButton: PropTypes.bool,
    onLoadMoreDiscussions: PropTypes.func.isRequired,
    onDiscussionEditDone: PropTypes.func.isRequired,
    onDiscussionDelete: PropTypes.func.isRequired,
    onLoadDiscussionComments: PropTypes.func.isRequired,
    setDiscussionDifficulty: PropTypes.func.isRequired,
    style: PropTypes.object,
    type: PropTypes.string,
    uploadDiscussion: PropTypes.func.isRequired,
    commentActions: PropTypes.shape({
      attachStar: PropTypes.func.isRequired,
      editRewardComment: PropTypes.func.isRequired,
      onDelete: PropTypes.func.isRequired,
      onEditDone: PropTypes.func.isRequired,
      onLikeClick: PropTypes.func.isRequired,
      onLoadMoreComments: PropTypes.func.isRequired,
      onLoadMoreReplies: PropTypes.func.isRequired,
      onUploadComment: PropTypes.func.isRequired,
      onUploadReply: PropTypes.func.isRequired
    })
  };
  render() {
    const {
      className,
      discussions,
      loadMoreButton,
      style = {},
      type,
      contentId,
      uploadDiscussion,
      onDiscussionEditDone,
      onDiscussionDelete,
      onLoadDiscussionComments,
      setDiscussionDifficulty,
      commentActions: {
        attachStar,
        editRewardComment,
        onDelete,
        onEditDone,
        onLikeClick,
        onLoadMoreComments,
        onLoadMoreReplies,
        onUploadComment,
        onUploadReply
      }
    } = this.props;
    return (
      <Context.Provider
        value={{
          attachStar,
          editRewardComment,
          onDelete,
          onEditDone,
          onLikeClick,
          onLoadMoreComments,
          onLoadMoreReplies,
          onDiscussionEditDone,
          onDiscussionDelete,
          onLoadDiscussionComments,
          setDiscussionDifficulty,
          onUploadComment,
          onUploadReply
        }}
      >
        <div className={className} style={style}>
          <DiscussionInputArea
            contentId={contentId}
            type={type}
            onUploadDiscussion={uploadDiscussion}
          />
          <div style={{ margin: '1rem 0' }}>
            {discussions &&
              discussions.map(discussion => (
                <DiscussionPanel
                  key={discussion.id}
                  contentId={Number(contentId)}
                  type={type}
                  {...discussion}
                />
              ))}
            {loadMoreButton && (
              <Button
                style={{ width: '100%', borderRadius: 0 }}
                filled
                info
                onClick={this.onLoadMoreDiscussions}
              >
                Load More Discussions
              </Button>
            )}
          </div>
        </div>
      </Context.Provider>
    );
  }

  onLoadMoreDiscussions = async() => {
    const { onLoadMoreDiscussions, type, contentId, discussions } = this.props;
    const data = await loadDiscussions({
      type,
      contentId,
      lastDiscussionId: discussions[discussions.length - 1].id
    });
    onLoadMoreDiscussions(data);
  };
}
