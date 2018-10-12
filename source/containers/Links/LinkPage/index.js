import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loading from 'components/Loading';
import Embedly from 'components/Embedly';
import {
  attachStar,
  loadLinkPage,
  deleteComment,
  deleteLinkFromPage,
  editComment,
  deleteDiscussion,
  editDiscussion,
  editLinkPage,
  editRewardComment,
  fetchComments,
  fetchMoreComments,
  fetchMoreReplies,
  fetchDiscussionComments,
  fetchDiscussions,
  fetchMoreDiscussions,
  fetchMoreDiscussionComments,
  fetchMoreDiscussionReplies,
  likeComment,
  likeLink,
  resetPage,
  setDiscussionDifficulty,
  uploadComment,
  uploadDiscussion,
  uploadReply
} from 'redux/actions/LinkActions';
import Comments from 'components/Comments';
import Discussions from 'components/Discussions';
import LikeButton from 'components/Buttons/LikeButton';
import Likers from 'components/Likers';
import ConfirmModal from 'components/Modals/ConfirmModal';
import UserListModal from 'components/Modals/UserListModal';
import Description from './Description';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';
import NotFound from 'components/NotFound';
import { loadComments, loadDiscussions } from 'helpers/requestHelpers';

class LinkPage extends Component {
  static propTypes = {
    attachStar: PropTypes.func.isRequired,
    deleteComment: PropTypes.func.isRequired,
    deleteDiscussion: PropTypes.func.isRequired,
    deleteLinkFromPage: PropTypes.func.isRequired,
    editComment: PropTypes.func.isRequired,
    editDiscussion: PropTypes.func.isRequired,
    editLinkPage: PropTypes.func.isRequired,
    editRewardComment: PropTypes.func.isRequired,
    fetchComments: PropTypes.func.isRequired,
    fetchMoreComments: PropTypes.func.isRequired,
    fetchMoreReplies: PropTypes.func.isRequired,
    fetchDiscussionComments: PropTypes.func.isRequired,
    fetchDiscussions: PropTypes.func.isRequired,
    fetchMoreDiscussions: PropTypes.func.isRequired,
    fetchMoreDiscussionComments: PropTypes.func.isRequired,
    fetchMoreDiscussionReplies: PropTypes.func.isRequired,
    likeComment: PropTypes.func.isRequired,
    likeLink: PropTypes.func.isRequired,
    loadLinkPage: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    myId: PropTypes.number,
    pageProps: PropTypes.object.isRequired,
    resetPage: PropTypes.func.isRequired,
    setDiscussionDifficulty: PropTypes.func.isRequired,
    uploadComment: PropTypes.func.isRequired,
    uploadDiscussion: PropTypes.func.isRequired,
    uploadReply: PropTypes.func.isRequired
  };

  state = {
    confirmModalShown: false,
    likesModalShown: false,
    notFound: false
  };

  async componentDidMount() {
    const {
      match: {
        params: { linkId }
      },
      loadLinkPage,
      fetchComments,
      fetchDiscussions
    } = this.props;
    try {
      await loadLinkPage(linkId);
      const discussionsObj = await loadDiscussions({
        type: 'url',
        contentId: linkId
      });
      fetchDiscussions(discussionsObj);
      const commentsObj = await loadComments({
        id: linkId,
        type: 'url',
        limit: 5
      });
      if (commentsObj) fetchComments(commentsObj);
    } catch (error) {
      if (error.response) {
        const { data = {} } = error.response;
        if (data.notFound) {
          this.setState({ notFound: true });
        }
      }
      console.error(error.response || error);
    }
  }

  async componentDidUpdate(prevProps) {
    const {
      location,
      loadLinkPage,
      fetchComments,
      match: {
        params: { linkId }
      }
    } = this.props;
    if (prevProps.location.pathname !== location.pathname) {
      try {
        await loadLinkPage(linkId);
        const commentsObj = await loadComments({
          id: linkId,
          type: 'url'
        });
        if (commentsObj) fetchComments(commentsObj);
      } catch (error) {
        if (error.response) {
          const { data = {} } = error.response;
          if (data.notFound) {
            this.setState({ notFound: true });
          }
        }
        console.error(error.response || error);
      }
    }
  }

  componentWillUnmount() {
    const { resetPage } = this.props;
    resetPage();
  }

  render() {
    const {
      pageProps: {
        id,
        title,
        content,
        description,
        discussions,
        discussionsLoadMoreButton,
        timeStamp,
        uploader,
        uploaderAuthLevel,
        uploaderName,
        comments = [],
        likes = [],
        loadMoreCommentsButton = false,
        ...embedlyProps
      },
      attachStar,
      deleteComment,
      deleteDiscussion,
      deleteLinkFromPage,
      editComment,
      editDiscussion,
      editLinkPage,
      editRewardComment,
      fetchMoreComments,
      fetchMoreReplies,
      fetchMoreDiscussions,
      fetchDiscussionComments,
      fetchMoreDiscussionComments,
      fetchMoreDiscussionReplies,
      likeComment,
      likeLink,
      myId,
      setDiscussionDifficulty,
      uploadComment,
      uploadDiscussion,
      uploadReply
    } = this.props;
    const { confirmModalShown, likesModalShown, notFound } = this.state;
    let userLikedThis = false;
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].userId === myId) userLikedThis = true;
    }

    return id ? (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          fontSize: '1.7rem',
          paddingBottom: '10rem'
        }}
      >
        <div
          className={css`
            width: 60%;
            background-color: #fff;
            padding-bottom: 1rem;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
            }
          `}
        >
          <Description
            key={'description' + id}
            content={content}
            uploaderAuthLevel={uploaderAuthLevel}
            uploaderId={uploader}
            uploaderName={uploaderName}
            timeStamp={timeStamp}
            myId={myId}
            title={title}
            url={content}
            description={description}
            linkId={id}
            onDelete={() => this.setState({ confirmModalShown: true })}
            onEditDone={params => editLinkPage(params)}
          />
          <Embedly
            key={'link' + id}
            title={title}
            style={{ marginTop: '2rem' }}
            id={id}
            url={content}
            {...embedlyProps}
          />
          <div
            style={{
              paddingTop: '1.5rem',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <LikeButton
              key={'like' + id}
              filled
              style={{ fontSize: '2rem' }}
              contentType="url"
              contentId={id}
              onClick={likes => likeLink(likes)}
              liked={userLikedThis}
            />
            <Likers
              key={'likes' + id}
              style={{ marginTop: '0.5rem', fontSize: '1.3rem' }}
              likes={likes}
              userId={myId}
              onLinkClick={() => this.setState({ likesModalShown: true })}
            />
          </div>
        </div>
        <Discussions
          className={css`
            width: 60%;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
            }
          `}
          contentId={id}
          loadMoreButton={discussionsLoadMoreButton}
          discussions={discussions}
          onLoadMoreDiscussions={fetchMoreDiscussions}
          onLoadDiscussionComments={fetchDiscussionComments}
          onDiscussionEditDone={editDiscussion}
          onDiscussionDelete={deleteDiscussion}
          setDiscussionDifficulty={setDiscussionDifficulty}
          uploadDiscussion={uploadDiscussion}
          type="url"
          commentActions={{
            attachStar,
            editRewardComment,
            onDelete: deleteComment,
            onEditDone: editComment,
            onLikeClick: likeComment,
            onLoadMoreComments: fetchMoreDiscussionComments,
            onLoadMoreReplies: fetchMoreDiscussionReplies,
            onUploadComment: uploadComment,
            onUploadReply: uploadReply
          }}
        />
        <Comments
          autoExpand
          comments={comments}
          inputTypeLabel="comment"
          key={'comments' + id}
          loadMoreButton={loadMoreCommentsButton}
          loadMoreComments={fetchMoreComments}
          onAttachStar={attachStar}
          onCommentSubmit={uploadComment}
          onDelete={deleteComment}
          onEditDone={editComment}
          onLikeClick={likeComment}
          onLoadMoreReplies={fetchMoreReplies}
          onReplySubmit={uploadReply}
          onRewardCommentEdit={editRewardComment}
          parent={{ type: 'url', id }}
          className={css`
            padding: 1rem;
            width: 60%;
            background: #fff;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
            }
          `}
          userId={myId}
        />
        {confirmModalShown && (
          <ConfirmModal
            key={'confirm' + id}
            title="Remove Link"
            onConfirm={() => deleteLinkFromPage(id)}
            onHide={() => this.setState({ confirmModalShown: false })}
          />
        )}
        {likesModalShown && (
          <UserListModal
            key={'userlist' + id}
            users={likes}
            userId={myId}
            title="People who liked this"
            description="(You)"
            onHide={() => this.setState({ likesModalShown: false })}
          />
        )}
      </div>
    ) : notFound ? (
      <NotFound />
    ) : (
      <Loading text="Loading Page..." />
    );
  }
}

export default connect(
  state => ({
    pageProps: state.LinkReducer.linkPage,
    myId: state.UserReducer.userId
  }),
  {
    attachStar,
    loadLinkPage,
    deleteComment,
    deleteDiscussion,
    deleteLinkFromPage,
    editComment,
    editDiscussion,
    editLinkPage,
    editRewardComment,
    fetchComments,
    fetchDiscussionComments,
    fetchMoreComments,
    fetchMoreReplies,
    fetchDiscussions,
    fetchMoreDiscussions,
    fetchMoreDiscussionComments,
    fetchMoreDiscussionReplies,
    likeComment,
    likeLink,
    resetPage,
    setDiscussionDifficulty,
    uploadComment,
    uploadReply,
    uploadDiscussion
  }
)(LinkPage);
