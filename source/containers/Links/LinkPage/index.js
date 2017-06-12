import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {connect} from 'react-redux'
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
import UserListModal from 'components/Modals/UserListModal'
import Description from './Description'

@connect(
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
)
export default class LinkPage extends Component {
  static propTypes = {
    match: PropTypes.object,
    pageProps: PropTypes.object,
    loadLinkPage: PropTypes.func,
    likeComment: PropTypes.func,
    likeLink: PropTypes.func,
    deleteComment: PropTypes.func,
    deleteLinkFromPage: PropTypes.func,
    editComment: PropTypes.func,
    editLinkPage: PropTypes.func,
    fetchComments: PropTypes.func,
    fetchMoreReplies: PropTypes.func,
    fetchMoreComments: PropTypes.func,
    location: PropTypes.object,
    submitComment: PropTypes.func,
    submitReply: PropTypes.func,
    myId: PropTypes.number
  }

  constructor(props) {
    super()
    this.state = {
      likersModalShown: false
    }
    this.onCommentDelete = this.onCommentDelete.bind(this)
    this.onCommentEditDone = this.onCommentEditDone.bind(this)
    this.onCommentLike = this.onCommentLike.bind(this)
    this.onCommentSubmit = this.onCommentSubmit.bind(this)
    this.onReplySubmit = this.onReplySubmit.bind(this)
    this.loadMoreComments = this.loadMoreComments.bind(this)
    this.loadMoreReplies = this.loadMoreReplies.bind(this)
  }

  componentDidMount() {
    const {match: {params: {linkId}}, loadLinkPage, fetchComments} = this.props
    fetchComments(linkId)
    return loadLinkPage(linkId)
  }

  componentDidUpdate(prevProps) {
    const {location, loadLinkPage, fetchComments, match: {params: {linkId}}} = this.props
    if (prevProps.location.pathname !== location.pathname) {
      fetchComments(linkId)
      return loadLinkPage(linkId)
    }
  }

  render() {
    const {
      pageProps: {
        id, title, content,
        description, timeStamp,
        uploader, uploaderName,
        comments = [], likers = [],
        loadMoreCommentsButton = false
      },
      editLinkPage,
      likeLink,
      deleteLinkFromPage,
      myId
    } = this.props
    const {likersModalShown} = this.state
    let userLikedThis = false
    for (let i = 0; i < likers.length; i++) {
      if (likers[i].userId === myId) userLikedThis = true
    }

    if (!id) return <Loading text="Loading Page" />
    return (
      <div
        className="col-md-6 col-md-offset-3"
        style={{
          backgroundColor: '#fff',
          paddingBottom: '2em'
        }}
      >
        <div className="container-fluid">
          <Description
            uploaderId={uploader}
            uploaderName={uploaderName}
            timeStamp={timeStamp}
            myId={myId}
            title={title}
            url={content}
            description={description}
            linkId={id}
            onDelete={() => deleteLinkFromPage(id)}
            onEditDone={params => editLinkPage(params)}
          />
          <Embedly style={{marginTop: '1.5rem'}} url={content} />
          <div style={{paddingTop: '1.5em', textAlign: 'center'}}>
            <LikeButton
              onClick={() => likeLink(id)}
              liked={userLikedThis}
            />
            <Likers
              style={{marginTop: '0.5em'}}
              likes={likers}
              userId={myId}
              onLinkClick={() => this.setState({likersModalShown: true})}
            />
          </div>
          <PanelComments
            style={{marginTop: '0.5em'}}
            comments={comments}
            onSubmit={this.onCommentSubmit}
            loadMoreButton={loadMoreCommentsButton}
            inputTypeLabel="comment"
            parent={{type: 'url', id}}
            userId={myId}
            commentActions={{
              onDelete: this.onCommentDelete,
              onLikeClick: this.onCommentLike,
              onEditDone: this.onCommentEditDone,
              onReplySubmit: this.onReplySubmit,
              onLoadMoreReplies: this.loadMoreReplies
            }}
            loadMoreComments={this.loadMoreComments}
          />
        </div>
        {likersModalShown &&
          <UserListModal
            users={likers}
            userId={myId}
            title="People who liked this"
            description="(You)"
            onHide={() => this.setState({likersModalShown: false})}
          />
        }
      </div>
    )
  }

  loadMoreComments() {
    const {fetchMoreComments, pageProps: {id, comments}} = this.props
    const lastCommentId = comments[comments.length - 1].id
    fetchMoreComments(id, lastCommentId)
  }

  loadMoreReplies(lastReplyId, commentId) {
    const {fetchMoreReplies} = this.props
    fetchMoreReplies(lastReplyId, commentId)
  }

  onCommentDelete(commentId) {
    const {deleteComment} = this.props
    deleteComment(commentId)
  }

  onCommentEditDone(editedComment, callback) {
    const {editComment} = this.props
    editComment(editedComment, callback)
  }

  onCommentLike(commentId) {
    const {likeComment} = this.props
    likeComment(commentId)
  }

  onCommentSubmit(content) {
    const {submitComment, match: {params: {linkId}}} = this.props
    submitComment({content, linkId})
  }

  onReplySubmit(params) {
    const {submitReply} = this.props
    submitReply({
      ...params,
      replyOfReply: true
    })
  }
}
