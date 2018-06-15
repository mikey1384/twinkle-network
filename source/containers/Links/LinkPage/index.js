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
  submitComment,
  submitReply
} from 'redux/actions/LinkActions'
import PanelComments from 'components/PanelComments'
import LikeButton from 'components/Buttons/LikeButton'
import Likers from 'components/Likers'
import ConfirmModal from 'components/Modals/ConfirmModal'
import UserListModal from 'components/Modals/UserListModal'
import Description from './Description'
import { css } from 'emotion'
import { mobileMaxWidth } from 'constants/css'
import NotFound from 'components/NotFound'

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
    submitComment: PropTypes.func.isRequired,
    submitReply: PropTypes.func.isRequired
  }

  state = {
    confirmModalShown: false,
    likersModalShown: false,
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
    } catch (error) {
      if (error.response) {
        const { data = {} } = error.response
        if (data.notFound) {
          this.setState({ notFound: true })
        }
      }
    }
    fetchComments(linkId)
  }

  componentDidUpdate(prevProps) {
    const {
      location,
      loadLinkPage,
      fetchComments,
      match: {
        params: { linkId }
      }
    } = this.props
    if (prevProps.location.pathname !== location.pathname) {
      fetchComments(linkId)
      loadLinkPage(linkId)
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
        likers = [],
        loadMoreCommentsButton = false,
        ...embedlyProps
      },
      attachStar,
      deleteComment,
      editComment,
      editLinkPage,
      editRewardComment,
      fetchMoreReplies,
      likeComment,
      likeLink,
      deleteLinkFromPage,
      myId
    } = this.props
    const { confirmModalShown, likersModalShown, notFound } = this.state
    let userLikedThis = false
    for (let i = 0; i < likers.length; i++) {
      if (likers[i].userId === myId) userLikedThis = true
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
          <div style={{ paddingTop: '1.5rem', textAlign: 'center' }}>
            <LikeButton
              key={'like' + id}
              filled
              style={{ fontSize: '2rem' }}
              onClick={() => likeLink(id)}
              liked={userLikedThis}
            />
            <Likers
              key={'likers' + id}
              style={{ marginTop: '0.5rem', fontSize: '1.3rem' }}
              likes={likers}
              userId={myId}
              onLinkClick={() => this.setState({ likersModalShown: true })}
            />
          </div>
          <PanelComments
            key={'comments' + id}
            style={{ padding: '1rem' }}
            comments={comments}
            onSubmit={this.onCommentSubmit}
            loadMoreButton={loadMoreCommentsButton}
            inputTypeLabel="comment"
            parent={{ type: 'url', id }}
            userId={myId}
            commentActions={{
              attachStar,
              onDelete: deleteComment,
              onLikeClick: likeComment,
              onEditDone: editComment,
              onReplySubmit: this.onReplySubmit,
              onLoadMoreReplies: fetchMoreReplies,
              onRewardCommentEdit: editRewardComment
            }}
            loadMoreComments={this.loadMoreComments}
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
        {likersModalShown && (
          <UserListModal
            key={'userlist' + id}
            users={likers}
            userId={myId}
            title="People who liked this"
            description="(You)"
            onHide={() => this.setState({ likersModalShown: false })}
          />
        )}
      </div>
    ) : notFound ? (
      <NotFound />
    ) : (
      <Loading text="Loading Page..." />
    )
  }

  loadMoreComments = () => {
    const {
      fetchMoreComments,
      pageProps: { id, comments }
    } = this.props
    const lastCommentId = comments[comments.length - 1].id
    fetchMoreComments(id, lastCommentId)
  }

  onCommentSubmit = content => {
    const {
      submitComment,
      match: {
        params: { linkId }
      }
    } = this.props
    submitComment({ content, linkId })
  }

  onReplySubmit = params => {
    const { submitReply } = this.props
    submitReply({
      ...params,
      replyOfReply: true
    })
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
    submitComment,
    submitReply
  }
)(LinkPage)
