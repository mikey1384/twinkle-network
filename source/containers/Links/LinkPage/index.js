import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Loading from 'components/Loading'
import Embedly from 'components/Embedly'
import {
  loadLinkPage,
  deleteComment,
  deleteLinkFromPage,
  editComment,
  editLinkPage,
  fetchComments,
  fetchMoreComments,
  fetchMoreReplies,
  likeComment,
  likeLink,
  submitComment,
  submitReply
} from 'redux/actions/LinkActions'
import PanelComments from 'components/PanelComments'
import LikeButton from 'components/LikeButton'
import Likers from 'components/Likers'
import ConfirmModal from 'components/Modals/ConfirmModal'
import UserListModal from 'components/Modals/UserListModal'
import Description from './Description'
import { css } from 'emotion'
import { mobileMaxWidth } from '../../../constants/css'

class LinkPage extends Component {
  static propTypes = {
    deleteComment: PropTypes.func.isRequired,
    deleteLinkFromPage: PropTypes.func.isRequired,
    editComment: PropTypes.func.isRequired,
    editLinkPage: PropTypes.func.isRequired,
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
    submitComment: PropTypes.func.isRequired,
    submitReply: PropTypes.func.isRequired
  }

  state = {
    confirmModalShown: false,
    likersModalShown: false
  }

  componentDidMount() {
    const {
      match: { params: { linkId } },
      loadLinkPage,
      fetchComments
    } = this.props
    fetchComments(linkId)
    loadLinkPage(linkId)
  }

  componentDidUpdate(prevProps) {
    const {
      location,
      loadLinkPage,
      fetchComments,
      match: { params: { linkId } }
    } = this.props
    if (prevProps.location.pathname !== location.pathname) {
      fetchComments(linkId)
      loadLinkPage(linkId)
    }
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
        uploaderName,
        comments = [],
        likers = [],
        loadMoreCommentsButton = false,
        ...embedlyProps
      },
      deleteComment,
      editComment,
      editLinkPage,
      fetchMoreReplies,
      likeComment,
      likeLink,
      deleteLinkFromPage,
      myId
    } = this.props
    const { confirmModalShown, likersModalShown } = this.state
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
            padding: 1rem;
            margin-bottom: 1rem;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
            }
          `}
        >
          <Description
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
            title={title}
            style={{ marginTop: '2rem' }}
            id={id}
            url={content}
            {...embedlyProps}
          />
          <div style={{ paddingTop: '1.5rem', textAlign: 'center' }}>
            <LikeButton
              filled
              style={{ fontSize: '2rem' }}
              onClick={() => likeLink(id)}
              liked={userLikedThis}
            />
            <Likers
              style={{ marginTop: '0.5rem', fontSize: '1.3rem' }}
              likes={likers}
              userId={myId}
              onLinkClick={() => this.setState({ likersModalShown: true })}
            />
          </div>
          <PanelComments
            style={{ marginTop: '1rem' }}
            comments={comments}
            onSubmit={this.onCommentSubmit}
            loadMoreButton={loadMoreCommentsButton}
            inputTypeLabel="comment"
            parent={{ type: 'url', id }}
            userId={myId}
            commentActions={{
              onDelete: deleteComment,
              onLikeClick: likeComment,
              onEditDone: editComment,
              onReplySubmit: this.onReplySubmit,
              onLoadMoreReplies: fetchMoreReplies
            }}
            loadMoreComments={this.loadMoreComments}
          />
        </div>
        {confirmModalShown && (
          <ConfirmModal
            title="Remove Link"
            onConfirm={() => deleteLinkFromPage(id)}
            onHide={() => this.setState({ confirmModalShown: false })}
          />
        )}
        {likersModalShown && (
          <UserListModal
            users={likers}
            userId={myId}
            title="People who liked this"
            description="(You)"
            onHide={() => this.setState({ likersModalShown: false })}
          />
        )}
      </div>
    ) : (
      <div style={{ position: 'relative', width: '100%', height: '20%' }}>
        <Loading text="Loading Page" />
      </div>
    )
  }

  loadMoreComments = () => {
    const { fetchMoreComments, pageProps: { id, comments } } = this.props
    const lastCommentId = comments[comments.length - 1].id
    fetchMoreComments(id, lastCommentId)
  }

  onCommentSubmit = content => {
    const { submitComment, match: { params: { linkId } } } = this.props
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
    loadLinkPage,
    deleteComment,
    deleteLinkFromPage,
    editComment,
    editLinkPage,
    fetchComments,
    fetchMoreComments,
    fetchMoreReplies,
    likeComment,
    likeLink,
    submitComment,
    submitReply
  }
)(LinkPage)
