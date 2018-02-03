import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ContentPanel from 'components/ContentPanel'
import { connect } from 'react-redux'
import request from 'axios'
import { URL } from 'constants/URL'
import { auth, handleError } from 'redux/actions/constants'

class Comment extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    userId: PropTypes.number,
    history: PropTypes.object.isRequired
  }

  state = {
    contentObj: {}
  }

  async componentDidMount() {
    const { match, match: { params: { contentId } } } = this.props
    try {
      const { data } = await request.get(
        `${URL}/content/${match.url
          .split('/')[1]
          .slice(0, -1)}?contentId=${contentId}`
      )
      this.setState({ contentObj: data })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const { userId } = this.props
    const { contentObj } = this.state
    return (
      <ContentPanel
        selfLoadingDisabled
        contentObj={contentObj}
        methodObj={{
          onCommentSubmit: this.onCommentSubmit,
          onReplySubmit: this.onReplySubmit,
          onTargetCommentSubmit: this.onTargetCommentSubmit,
          onLikeContent: this.onLikeContent,
          onLikeComment: this.onLikeComment,
          onLikeTargetComment: this.onLikeTargetComment,
          onLikeQuestion: this.onLikeQuestion,
          onDeleteContent: this.onDeleteContent,
          onEditContent: this.onEditContent,
          onDeleteComment: this.onDeleteComment,
          onEditComment: this.onEditComment,
          onLoadMoreComments: this.onLoadMoreComments,
          onLoadMoreReplies: this.onLoadMoreReplies,
          onShowComments: this.onShowComments
        }}
        userId={userId}
      />
    )
  }

  onCommentSubmit = async(comment, parent) => {
    const { handleError } = this.props
    const contentType = parent.type
    let commentType
    let params
    switch (contentType) {
      case 'comment':
        params = {
          content: comment,
          rootId: parent.rootId,
          rootType: parent.rootType,
          discussionId: parent.discussionId,
          commentId: parent.commentId || parent.id,
          replyId: parent.commentId ? parent.id : null
        }
        commentType = 'replies'
        break
      case 'question':
        params = { content: comment, rootId: parent.id, rootType: 'question' }
        commentType = 'comments'
        break
      default:
        return console.error('Invalid content type')
    }
    try {
      const { data } = await request.post(
        `${URL}/content/${commentType}`,
        params,
        auth()
      )
      this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          childComments: [data].concat(state.contentObj.childComments)
        }
      }))
    } catch (error) {
      console.error(error.response || error)
      handleError(error)
    }
  }

  onReplySubmit = async({
    replyContent,
    parent,
    comment,
    replyOfReply,
    originType
  }) => {
    const { handleError } = this.props
    const params = {
      content: replyContent,
      rootId: parent.rootId,
      rootType: parent.rootType,
      discussionId: parent.discussionId,
      commentId: comment.commentId || comment.id,
      replyId: comment.commentId ? comment.id : null
    }
    try {
      const { data } = await request.post(
        `${URL}/content/replies`,
        params,
        auth()
      )
      const reply = {
        ...data,
        replyOfReply,
        originType
      }
      this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          childComments: state.contentObj.childComments.map(childComment => ({
            ...childComment,
            replies:
              childComment.id === comment.id ||
              childComment.id === reply.commentId
                ? (childComment.replies || []).concat(reply)
                : childComment.replies
          }))
        }
      }))
    } catch (error) {
      console.error(error.response || error)
      handleError(error)
    }
  }

  onDeleteComment = async commentId => {
    const { handleError } = this.props
    try {
      await request.delete(
        `${URL}/content/comments?commentId=${commentId}`,
        auth()
      )
      this.setState(state => {
        const comments = state.contentObj.childComments.filter(
          comment => comment.id !== commentId
        )
        return {
          contentObj: {
            ...state.contentObj,
            childComments: comments.map(comment => ({
              ...comment,
              replies: comment.replies.filter(reply => reply.id !== commentId)
            }))
          }
        }
      })
    } catch (error) {
      console.error(error.response || error)
      handleError(error)
    }
  }

  onEditComment = async params => {
    const { handleError } = this.props
    try {
      const { data: { editedComment, commentId } } = await request.put(
        `${URL}/content/comments`,
        params,
        auth()
      )
      this.setState(state => {
        const comments = state.contentObj.childComments.map(comment => ({
          ...comment,
          content: comment.id === commentId ? editedComment : comment.content
        }))
        return {
          contentObj: {
            ...state.contentObj,
            childComments: comments.map(comment => ({
              ...comment,
              replies: comment.replies.map(reply => ({
                ...reply,
                content: reply.id === commentId ? editedComment : reply.content
              }))
            }))
          }
        }
      })
    } catch (error) {
      console.error(error.response || error)
      handleError(error)
    }
  }

  onDeleteContent = async({ contentId, type }) => {
    const { handleError, history } = this.props
    try {
      await request.delete(
        `${URL}/content?contentId=${contentId}&type=${type}`,
        auth()
      )
      history.push('/')
    } catch (error) {
      console.error(error.response || error)
      handleError(error)
    }
  }

  onEditContent = async params => {
    const { handleError } = this.props
    try {
      const { data } = await request.put(`${URL}/content`, params, auth())
      this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          ...data
        }
      }))
    } catch (error) {
      console.error(error.response || error)
      handleError(error)
    }
  }

  onLikeComment = async commentId => {
    const { handleError } = this.props
    try {
      const { data: { likes } } = await request.post(
        `${URL}/content/comment/like`,
        {
          commentId
        },
        auth()
      )
      this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          contentLikers:
            state.contentObj.contentId === commentId
              ? likes
              : state.contentObj.contentLikers,
          childComments: state.contentObj.childComments.map(comment => ({
            ...comment,
            likes: comment.id === commentId ? likes : comment.likes,
            replies: comment.replies.map(reply => ({
              ...reply,
              likes: reply.id === commentId ? likes : reply.likes
            }))
          }))
        }
      }))
    } catch (error) {
      console.error(error.response || error)
      handleError(error)
    }
  }

  onLikeTargetComment = async commentId => {
    const { handleError } = this.props
    try {
      const { data: { likes } } = await request.post(
        `${URL}/content/comment/like`,
        { commentId },
        auth()
      )
      this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          targetContentLikers: likes
        }
      }))
    } catch (error) {
      console.error(error.response || error)
      handleError(error)
    }
  }

  onLikeContent = async(contentId, contentType) => {
    const { handleError } = this.props
    try {
      const { data: { likes } } = await request.post(
        `${URL}/${contentType}/like`,
        { contentId },
        auth()
      )
      this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          rootContentLikers: likes
        }
      }))
    } catch (error) {
      console.error(error.response || error)
      handleError(error)
    }
  }

  onLikeQuestion = async contentId => {
    const { handleError } = this.props
    try {
      const { data: { likes } } = await request.post(
        `${URL}/content/question/like`,
        {
          contentId
        },
        auth()
      )
      this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          contentLikers: likes
        }
      }))
    } catch (error) {
      console.error(error.response || error)
      handleError(error)
    }
  }

  onLoadMoreComments = async({
    contentId,
    isReply,
    rootType,
    type,
    lastCommentId
  }) => {
    try {
      const { data } = await request.get(
        `
          ${URL}/content/comments?rootType=${rootType}&type=${type}&contentId=${contentId}&isReply=${isReply}&lastCommentId=${lastCommentId}
        `
      )
      let commentsLoadMoreButton = false
      if (data.length > 3) {
        data.pop()
        commentsLoadMoreButton = true
      }
      this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          childComments: state.contentObj.childComments.concat(data),
          commentsLoadMoreButton
        }
      }))
    } catch (error) {
      console.error(error)
    }
  }

  onLoadMoreReplies = async(lastReplyId, commentId, parent) => {
    try {
      const { data: { replies, loadMoreReplies } } = await request.get(
        `${URL}/content/replies?lastReplyId=${lastReplyId}&commentId=${commentId}&rootType=${
          parent.rootType
        }`
      )
      this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          childComments: state.contentObj.childComments.map(comment => ({
            ...comment,
            replies:
              comment.id === commentId
                ? replies.concat(comment.replies)
                : comment.replies,
            loadMoreReplies:
              comment.id === commentId
                ? loadMoreReplies
                : comment.loadMoreReplies
          }))
        }
      }))
      return Promise.resolve()
    } catch (error) {
      console.error(error.response || error)
    }
  }

  onShowComments = async({ contentId, isReply, rootType, type }) => {
    try {
      const { data } = await request.get(
        `${URL}/content/comments?rootType=${rootType}&type=${type}&contentId=${contentId}&isReply=${isReply}`
      )
      let commentsLoadMoreButton = false
      if (data.length > 3) {
        data.pop()
        commentsLoadMoreButton = true
      }
      this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          childComments: data,
          commentsLoadMoreButton
        }
      }))
      return Promise.resolve()
    } catch (error) {
      console.error(error)
    }
  }

  onTargetCommentSubmit = async params => {
    const { handleError } = this.props
    try {
      const { data } = await request.post(
        `${URL}/content/targetContentComment`,
        params,
        auth()
      )
      this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          targetContentComments: [data].concat(
            state.contentObj.targetContentComments || []
          )
        }
      }))
    } catch (error) {
      console.error(error.response || error)
      handleError(error)
    }
  }
}

export default connect(
  state => ({
    userId: state.UserReducer.userId
  }),
  dispatch => ({
    handleError: error => handleError(error, dispatch)
  })
)(Comment)
