import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Loading from 'components/Loading'
import Embedly from 'components/Embedly'
import {
  attachStar,
  loadLinkPage,
  deleteComment,
  deleteLinkFromPage,
  editComment,
  editLinkPage,
  editRewardComment,
  fetchComments,
  fetchMoreComments,
  fetchMoreReplies,
  likeComment,
  likeLink,
  resetPage,
  uploadComment,
  uploadReply
} from 'redux/actions/LinkActions'
import Comments from 'components/Comments'
import LikeButton from 'components/Buttons/LikeButton'
import Likers from 'components/Likers'
import ConfirmModal from 'components/Modals/ConfirmModal'
import UserListModal from 'components/Modals/UserListModal'
import Description from './Description'
import { css } from 'emotion'
import { mobileMaxWidth } from 'constants/css'
import NotFound from 'components/NotFound'
import { loadComments } from 'helpers/requestHelpers'

class LinkPage extends Component {
  static propTypes = {
    attachStar: PropTypes.func.isRequired,
    deleteComment: PropTypes.func.isRequired,
    deleteLinkFromPage: PropTypes.func.isRequired,
    editComment: PropTypes.func.isRequired,
    editLinkPage: PropTypes.func.isRequired,
    editRewardComment: PropTypes.func.isRequired,
    fetchComments: PropTypes.func.isRequired,
    fetchMoreComments: PropTypes.func.isRequired,
    fetchMoreReplies: PropTypes.func.isRequired,
    likeComment: PropTypes.func.isRequired,
    likeLink: PropTypes.func.isRequired,
    loadLinkPage: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    myId: PropTypes.number,
    pageProps: PropTypes.object.isRequired,
    resetPage: PropTypes.func.isRequired,
    uploadComment: PropTypes.func.isRequired,
    uploadReply: PropTypes.func.isRequired
  }

  state = {
    confirmModalShown: false,
    likesModalShown: false,
    notFound: false
  }

  async componentDidMount() {
    const {
      match: {
        params: { linkId }
      },
      loadLinkPage,
      fetchComments
    } = this.props
    try {
      await loadLinkPage(linkId)
      const data = await loadComments({
        id: linkId,
        type: 'url'
      })
      if (data) fetchComments(data)
    } catch (error) {
      if (error.response) {
        const { data = {} } = error.response
        if (data.notFound) {
          this.setState({ notFound: true })
        }
      }
      console.error(error.response || error)
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
    } = this.props
    if (prevProps.location.pathname !== location.pathname) {
      try {
        await loadLinkPage(linkId)
        const data = await loadComments({
          id: linkId,
          type: 'url'
        })
        if (data) fetchComments(data)
      } catch (error) {
        if (error.response) {
          const { data = {} } = error.response
          if (data.notFound) {
            this.setState({ notFound: true })
          }
        }
        console.error(error.response || error)
      }
    }
  }

  componentWillUnmount() {
    const { resetPage } = this.props
    resetPage()
  }

  render() {
    const {
      pageProps: {
        id,
        title,
        content,
        description,
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
      deleteLinkFromPage,
      editComment,
      editLinkPage,
      editRewardComment,
      fetchMoreComments,
      fetchMoreReplies,
      likeComment,
      likeLink,
      myId,
      uploadComment,
      uploadReply
    } = this.props
    const { confirmModalShown, likesModalShown, notFound } = this.state
    let userLikedThis = false
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].userId === myId) userLikedThis = true
    }

    return id ? (
      <div
        className={css`
          display: flex;
          justify-content: center;
          width: 100%;
          font-size: 1.7rem;
        `}
      >
        <div
          className={css`
            width: 50%;
            background-color: #fff;
            margin-bottom: 1rem;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
              min-height: 100vh;
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
            style={{ padding: '1rem' }}
            userId={myId}
          />
        </div>
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
    )
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
    deleteLinkFromPage,
    editComment,
    editLinkPage,
    editRewardComment,
    fetchComments,
    fetchMoreComments,
    fetchMoreReplies,
    likeComment,
    likeLink,
    resetPage,
    uploadComment,
    uploadReply
  }
)(LinkPage)
